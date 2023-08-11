<?php

namespace App\Console\CommandHelpers;

use DeepL\Translator;
use RuntimeException;
use InvalidArgumentException;
use Illuminate\Support\Collection;
use Google\Cloud\Translate\V2\TranslateClient;
use BernskioldMedia\Autotranslate\TranslateStrings;

class MTranslateStrings extends TranslateStrings{   // mod that patches some bugs & adds Google Cloud Translation API support
    protected $gTranslator;
    protected $engine;
    protected $resetEntryCount = 0;

    public function __construct($engine){
        $this->engine = $engine;
        switch($engine){
            case 'google': $this->gTranslator = new TranslateClient(['key' => config('autotranslate.api_key_g')]); break;
            case 'deepl': parent::__construct(new Translator(config('autotranslate.api_key'))); break;
            default: throw new InvalidArgumentException('Selected engine not implemented.');
        }
    }

    public function getResetEntryCount() {return $this->resetEntryCount;}
    protected function getGTransOpts($target_lang){return ['source' => config('autotranslate.source_language'), 'target' => $target_lang, 'format' => $this->getOptionForLanguageOrDefault('tag_handling')];}
    protected function mapTagWraps(string $string): string{return preg_replace('/<NOTRANSLATE>(.+?)<\/NOTRANSLATE>/', '<p class="notranslate">$1</p>', $string);}
    protected function unmapTagWraps(string $string): string{return preg_replace('/<p class="notranslate">(.+?)<\/p>/', '<NOTRANSLATE>$1</NOTRANSLATE>', $string);}

    /**
     * @throws \DeepL\DeepLException
     */
    public function execute(Collection $strings, string $targetLanguage): Collection{
        $isHTML = $this->getOptionForLanguageOrDefault('tag_handling') == 'html';

        $stringsToTranslate = $this->resetNewlyExcludedWords($strings);
        $stringsToTranslate = $this->removePreviouslyTranslatedStrings($stringsToTranslate)
            ->map(fn ($string) => $this->wrapVariablesInTags($string))
            ->map(fn ($string) => $this->wrapExcludedWordsInTags($string));
        if($isHTML) $stringsToTranslate = $stringsToTranslate->map(fn ($string) => $this->mapTagWraps($string));

        $s2tVals = $stringsToTranslate->values()->toArray();
        if(count($s2tVals) == 0) return $strings;   // patch exception on empty input

        $translations = null;
        switch($this->engine){
            case 'google':
                $rawTranslations = $this->gTranslator->translateBatch(
                    $stringsToTranslate->values()->toArray(),
                    $this->getGTransOpts($targetLanguage)
                );
                $translations = collect($rawTranslations)->map(fn ($translation) => $translation['text']);
                break;
            case 'deepl':
                $rawTranslations = $this->translator->translateText(
                    texts: $s2tVals,
                    sourceLang: config('autotranslate.source_language'),
                    targetLang: strtoupper($targetLanguage),
                    options: $this->getDeepLTextOptions()
                );
                $translations = collect($rawTranslations)->map(fn ($translation) => $translation->text);
                break;
            default: throw new RuntimeException('Selected engine not implemented.');
        }

        if($isHTML) $translations = $translations->map(fn ($translation) => $this->unmapTagWraps($translation));
        $translations = $translations->map(fn ($translation) => $this->removeTagsFromVariables($translation))
            ->map(fn ($translation) => $this->unencodeHtmlEntities($translation));

        $translatedStrings = $stringsToTranslate->keys()->combine($translations);
        return $this->mergeNewTranslationsWithPrevious($translatedStrings, $strings);
    }

    protected function wrapExcludedWordsInTags(string $string): string{ // patch unescaped preg_replace delimiter
        $excludedWords = config('autotranslate.excluded_words');
        if(empty($excludedWords)) return $string;
        $excludedWords = collect($excludedWords)->map(fn ($word) => preg_quote($word, '/'))->implode('|');
        return preg_replace('/('.$excludedWords.')/', '<NOTRANSLATE>$1</NOTRANSLATE>', $string);
    }

    protected function resetNewlyExcludedWords(Collection $strings): Collection{
        $excludedWords = config('autotranslate.excluded_words');
        if(empty($excludedWords)) return $strings;
        $excludedWords = collect($excludedWords)->map(fn ($word) => preg_quote($word, '/'))->implode('|');
        $keysToReset = $strings->filter(fn($v, $k) => preg_match('/('.$excludedWords.')/', $k) && !preg_match('/('.$excludedWords.')/', $v))
            ->keys()->toArray();
        $resetEntries = array_filter(array_combine($keysToReset, $keysToReset));
        $this->resetEntryCount += count($resetEntries);
        return $strings->merge($resetEntries);
    }
}

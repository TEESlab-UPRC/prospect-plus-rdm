<?php

namespace App\Console\Commands;

use Exception;
use JsonException;
use function collect;
use function lang_path;
use function json_decode;
use const JSON_THROW_ON_ERROR;
use Illuminate\Support\Facades\File;
use App\Console\CommandHelpers\MTranslateStrings;
use BernskioldMedia\Autotranslate\TranslateStrings;
use BernskioldMedia\Autotranslate\Commands\TranslateFile;

class LangTranslate extends TranslateFile{  // mod that adds support for Google's Cloud Translation API, in addition to DeepL, using a modded TranslateStrings
    public $signature = 'lang:translate {engine} {lang}';
    public $description = 'Translate lang files with DeepL\'s or Google\'s Cloud Translation API.';

    protected static $engines = ['deepl', 'google'];
    protected static $jsonEncodingFlags = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR;

    public function handle(TranslateStrings $translator): int{
        $engine = $this->argument('engine');
        if(!in_array($engine, self::$engines)){
            $this->error('Engine not found. Supported engines: ' . implode(', ', self::$engines));
            return self::FAILURE;
        }
        $translator = new MTranslateStrings($engine);
        $language = $this->argument('lang');
        $fname = $language . '.json';
        $path = lang_path($fname);
        $errors = [];

        $this->info('Translating ' . $fname . '...');
        try{
            $contents = File::get($path);
            $originals = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
            $translations = collect($originals)
                ->chunk(50)
                ->map(function($chunk) use ($translator, $language, &$errors){
                    try{
                        return $translator->execute($chunk, $language)
                            ->map(fn ($value, $key) => ['original' => $key, 'translation' => $value]);
                    }catch (Exception $e){
                        $errors[] = $e->getMessage();
                        return collect();
                    }
                })
                ->flatten(1)
                ->pluck('translation', 'original');
            $entryResetCount = $translator->getResetEntryCount();
            if($entryResetCount > 0) $this->warn('Found and reset ' . $entryResetCount . ' entries with translated excluded words.');
            $stringsToSave = collect($originals)->merge($translations);
            File::put($path, json_encode($stringsToSave, self::$jsonEncodingFlags));
        }catch (JsonException $e){
            $this->error($e->getMessage());
            return self::FAILURE;
        }

        if(!empty($errors)){
            $this->error('The following errors occurred while translating ' . $fname . ':');
            foreach ($errors as $error) $this->error($error);
            return self::FAILURE;
        }
        $this->info('The file ' . $fname . ' was translated successfully.');
        return self::SUCCESS;
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use PDOException;

class LangGen extends Command{
    protected $signature = 'lang:gen {--skip-code} {--skip-db} {--skip-trans} {--skip-sort} {--y|confirm-trans}';
    protected $description = 'Generate and translate lang files.';

    protected static $transFuncs = ['__', 't', 'tHTML'];
    protected static $jsonEncodingFlags = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
    protected static $jsonSortingFlags = SORT_STRING | SORT_NATURAL | SORT_FLAG_CASE;

    protected function getLang() {return Storage::disk('lang');}
    protected function getApp() {return Storage::disk('app');}
    protected function getResources() {return Storage::disk('resources');}
    protected function mapArrayKeys($array, $map) {return array_combine(array_map(fn($k) => array_key_exists($k, $map) ? $map[$k] : $k, array_keys($array)), array_values($array));}
    protected function getJson($path) {return json_decode($this->getLang()->get($path), true);}
    protected function putJson($path, $content) {$this->getLang()->put($path, json_encode($content, self::$jsonEncodingFlags));}
    protected function mapJsonKeys($path, $map) {$this->putJson($path, $this->mapArrayKeys($this->getJson($path), $map));}
    protected function arrayLeftJoin($left, $right) {return array_filter(array_merge($left, $right), fn($k) => array_key_exists($k, $left), ARRAY_FILTER_USE_KEY);} // intersection keeps $right's values
    protected function arrayFilterEqualPairs($array, $invert = false) {return array_filter($array, $invert ? (fn($v, $k) => $v != $k) : (fn($v, $k) => $v == $k), ARRAY_FILTER_USE_BOTH);}
    protected function mergeEntries($oJson, $entries) {return array_merge(array_combine($entries, $entries), $oJson);}
    protected function arrayMergeFilterVals(...$arrays) {return array_values(array_filter(array_merge(...$arrays)));}

    protected function getTransFuncKeys($code) {
        if(!$code || empty($code)) return [];
        $code = str_replace(["\r", "\n"], ['\r', '\n'], $code);
        $code = preg_replace('/(\s\s+)/', ' ', $code);
        preg_match_all('/(?:^|\W)(?:' . join('|', self::$transFuncs) . ')\(\s*(?:\'(.+?)\'|"(.+?)"|`((?!.*\$\{).+?)`)(?:\s*,\s*(\[.*?\]|\{.*?\}))?\s*\)(?:\W|$)/', $code, $out);
        $recursionRes = array_map(fn($rc) => $this->getTransFuncKeys($rc), $this->arrayMergeFilterVals($out[4]));   // recurse for function's args
        return $this->arrayMergeFilterVals(...array_slice($out, 1, 3), ...$recursionRes);
    }

    protected function translate($oJson, $engine, ...$toLangs) {
        $fromLang = config('autotranslate.source_language') . '.json';
        $lang = $this->getLang();
        $keyMap = $this->arrayFilterEqualPairs($oJson, true);  // map of pairs where key != val, in orig

        array_walk($toLangs, function($toLang) use ($engine, $lang, $oJson, $fromLang, $keyMap){
            $new = $toLang . '.json';
            $nJson = null;
            $synced = false;

            $this->info('Updating ' . $new . '...');
            if($lang->exists($new)){  // sync according to orig's keys (add new, delete removed)
                $nJson = $this->getJson($new);
                $lJJson = $this->arrayLeftJoin($oJson, $nJson);
                if($nJson != $lJJson){
                    $synced = true;
                    $nJson = $lJJson;
                }
            }
            else{
                $lang->copy($fromLang, $new);
                $nJson = $oJson;
            }

            $nMapped = $this->mapArrayKeys($nJson, $keyMap);
            if(count($this->arrayFilterEqualPairs($nMapped)) == 0){
                if($synced) $this->putJson($new, $nJson);
                $this->info('The file ' . $new . ' is up to date.');
            }else{
                $this->putJson($new, $nMapped);
                $this->call('lang:translate', ['engine' => $engine, 'lang' => $toLang]);
                $this->mapJsonKeys($new, array_flip($keyMap));
            }
        });
    }

    protected function addFromCode($oJson){
        $app = $this->getApp();
        $resources = $this->getResources();
        $bFiles = preg_grep('/\.php$/', $app->allFiles());
        $fFiles = preg_grep('/\.(jsx?|php)$/', $resources->allFiles());
        $cEntries = $this->arrayMergeFilterVals(
            ...array_map(fn($f) => $this->getTransFuncKeys($app->get($f)), $bFiles),
            ...array_map(fn($f) => $this->getTransFuncKeys($resources->get($f)), $fFiles)
        );
        $cEntries = array_map(fn($m) => trim(preg_replace('/(^\\\\[rn]|\\\\[rn]$)/', '', trim($m))) , $cEntries);
        return $this->mergeEntries($oJson, $cEntries);
    }

    protected function addFromDB($oJson){
        return $this->mergeEntries($oJson, array_merge(...array_map(
            fn($e) => $e[0]::all()->map(fn($m) => $m->{$e[1]}())->toArray(),
            config("autotranslate.db_entry_sources")
        )));
    }

    protected function cannotTranslate($configApiKey, $engine){
        $toLangs = config('autotranslate.target_languages');
        return !config('autotranslate.' . $configApiKey) && key_exists($engine, $toLangs) && !empty($toLangs[$engine]);
    }

    protected function sortEntries($oJson){
        if($this->option('skip-sort')) $this->info('Skipping entry sort.');
        else{
            $this->info('Sorting entries...');
            $sJson = $oJson;
            ksort($sJson, self::$jsonSortingFlags);
            if(array_keys($sJson) == array_keys($oJson)) $this->info('Entries already sorted.');
            else{
                $oJson = $sJson;
                $this->info('Sorted entries.');
            }
        }
        return $oJson;
    }

    public function handle(){
        // INIT
        $fromLang = config('autotranslate.source_language') . '.json';
        $this->info('Initiating ' . $fromLang . ' update...');
        $oJson = $this->getJson($fromLang);
        $iJson = $oJson;

        // CODE SYNC
        if($this->option('skip-code')) $this->info('Skipping code sync.');
        else{
            $this->info('Looking for entries in the code...');
            $wC = $this->addFromCode($oJson);
            if($wC == $oJson) $this->info('Already synced with the code.');
            else{
                $changeNum = count(array_diff_assoc($wC, $oJson));
                $oJson = $wC;
                $this->info('Synced ' . $changeNum . ' code entries.');
            }
        }

        // DB SYNC
        if($this->option('skip-db')) $this->info('Skipping DB sync.');
        else{
            try{
                $this->info('Processing DB entries...');
                $wDB = $this->addFromDB($oJson);
                if($wDB == $oJson) $this->info('Already synced with DB.');
                else{
                    $changeNum = count(array_diff_assoc($wDB, $oJson));
                    $oJson = $wDB;
                    $this->info('Synced ' . $changeNum . ' DB entries.');
                }
            }catch(PDOException $e){
                $this->error('Failed to communicate with the DB! Check your .env and your DB.');
                if(!$this->confirm('Proceed without syncing with the DB entries?', false)){
                    $this->info('Aborting...');
                    return;
                }
            }
        }

        // SORT
        $oJson = $this->sortEntries($oJson);

        // CLEANUP
        $oJson = array_filter($oJson, fn($f) => strlen($f) > 0, ARRAY_FILTER_USE_KEY);

        // TRANSLATE
        if($this->option('skip-trans')) $this->info('Skipping translation.');
        else{
            if($this->cannotTranslate('api_key', 'deepl'))
                $this->error('No DeepL API key found in .env, skipping translation!');
            else if($this->cannotTranslate('api_key_g', 'google'))
                $this->error('No Google Cloud Translation API key found in .env, skipping translation!');
            else{
                $autoConfirm = $this->option('confirm-trans');
                $this->info("\nReady for translation!\nInput characters: " . strlen(implode($oJson)) . ($autoConfirm ? "\n" : ''));
                if($autoConfirm || $this->confirm('Proceed?')){
                    $toLangs = config('autotranslate.target_languages');
                    array_walk($toLangs, function($cLangs, $cEngine) use ($oJson){
                        $this->info('Translating using engine: ' . $cEngine);
                        $this->translate($oJson, $cEngine, ...$cLangs);
                        $this->newLine();
                    });
                }
            }
        }

        // WRITE en.json UPDATES FROM MEM TO DISK
        $this->info('Finalizing...');
        if($iJson != $oJson || array_keys($iJson) != array_keys($oJson))
            $this->putJson($fromLang, $oJson);   // orig updated, rewrite
        $this->info('Done. Have a good one!');
    }
}

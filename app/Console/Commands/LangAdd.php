<?php

namespace App\Console\Commands;

class LangAdd extends LangGen{
    protected $signature = 'lang:add {langKey} {--skip-sort}';
    protected $description = 'Add new translation entry. Does NOT automatically generate translations too.';

    public function handle(){
        $fromLang = config('autotranslate.source_language') . '.json';
        $oJson = $this->getJson($fromLang);
        $iJson = $oJson;
        $oJson = $this->mergeEntries($oJson, [$this->argument('langKey')]);
        if($iJson != $oJson){
            $this->info('Entry added to ' . $fromLang . '.');

            // SORT
            $oJson = $this->sortEntries($oJson);

            // WRITE en.json UPDATES FROM MEM TO DISK
            $this->info('Finalizing...');
            $this->putJson($fromLang, $oJson);
            $this->info('Done. Have a good one!');
        }else $this->comment('Entry already exists in ' . $fromLang . '.');
    }
}

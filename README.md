# Recommendations-Decision Matrix Tool
[PROSPECT+](https://h2020prospect.eu/) [Recommendations-Decision Matrix tool](https://rdmtool.teeslab.unipi.gr/), powered by [TEESlab](https://teeslab.unipi.gr/).

## Requirements
- PHP 8.1
### For development & building
- Node.js (>=16, latest LTS recommended)
- Composer

## Setup
```sh
composer install
npm ci
cp .env.example .env
php artisan key:generate
```
Make a DB and update [.env](.env) as needed.
```sh
php artisan migrate
php artisan db:seed
```

## Development
### Debugging
```sh
php artisan serve
npm run dev
```
Test by connecting to the Artisan server. For debugging the PHP side, XDebug can be used (+ PHP Debug plugin, if on VS Code).  
Vite should hot reload parts of the app, as files get changed (note: if using WSL2, this might not trigger, if the workspace is stored on Windows' hard drives, instead of inside WSL's FS).

### DB migrations
set up/upgrade DB: `php artisan migrate`  
reset DB: `php artisan migrate:fresh --seed`  
add DB table: `php artisan make:migration create_<name>_table --create=<name>`  
alter DB table: `php artisan make:migration <change>_<name>_table --table=<name>`

### DB seeding
run seeders: `php artisan db:seed`  
new seeder: `php artisan make:seeder <name>`  
_for the seeder to be called, it has to be executed via [DatabaseSeeder](database/seeders/DatabaseSeeder.php)'s run function, using the call method, like so:_
```php
$this->call([
    ...,
    <name>::class,
]);
```

### i18n
Translations in PHP: `__($key, $replacements)`  
Text Translations in JS: `t(key, replacements)`  
HTML Translations in React element properties: `{...tHTML(key, replacements)}`  
_see [resources/js/Helpers/TransHelpers.js](resources/js/Helpers/TransHelpers.js)_

The language files are in JSON and in [lang](lang).  
They can automatically be added to and translated using the following commands:
- Auto-add simple entries (from code & DB) and translate lang files: `php artisan lang:gen`
- Add new EN entry, no translation: `php artisan lang:add <langKey>`
- Translate lang files from EN: `php artisan lang:translate <engine> <lang>`

Automatic translations require a DeepL API key and a Google Cloud Translation API key to be set in [.env](.env).  
Extra settings for the automatic translations can be found in [config/autotranslate.php](config/autotranslate.php).

## Building & deploying
Adjust [.env](.env) accordingly.
```sh
composer install --no-dev --optimize-autoloader --no-plugins --no-scripts # for automations, also: --no-ansi --no-interaction --no-progress
npm run build
```
The web server should serve [public](public/).  
More deployment info [here](https://laravel.com/docs/10.x/deployment).

## Licensing notes
The [LICENSE](LICENSE) does not apply to the images included in this repo.  
The fonts in this repo are licensed under the [SIL Open Font License, Version 1.1.](https://scripts.sil.org/OFL)

## Disclaimer
This tool was developed under the H2020 PROSPECT+ project.  
_The PROSPECT+ project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 101023271. The content of this page is for information purpose only. The relevant legal instruments and the text of the call shall take precedence over the information contained in this page. The European Commission or CINEA does not accept responsibility for any use made of the information contained therein._

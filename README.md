# Prospect+ RDM
Prospect+ Recommendations-Decision Matrix tool

## Requirements
- PHP 8
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

## Building & deploying
Adjust [.env](.env) accordingly.
```sh
composer install --no-dev --optimize-autoloader --no-plugins --no-scripts # for automations, also: --no-ansi --no-interaction --no-progress
npm run build
```
The web server should serve [public](public/).  
More deployment info [here](https://laravel.com/docs/10.x/deployment).

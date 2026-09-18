# Program 1: Platform Admin Console (Laravel 11 + Filament)

Panel internal SuperAdmin untuk mengelola status tenant, memantau utilisasi kontainer server, alokasi kuota memori/CPU, dan rekonsiliasi billing.

## 🚀 Cara Menjalankan Lokal

```bash
cd services/01-admin-console
cp .env.example .env
composer install
php artisan key:generate
php artisan serve --port=8001
```

Buka browser di: [http://localhost:8001](http://localhost:8001)

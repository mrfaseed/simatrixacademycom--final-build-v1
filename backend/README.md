# Simatrix Academy Laravel backend

The former Flask service has been replaced by Laravel while retaining the frontend's existing `/api` contract and MySQL tables.

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan serve --host=0.0.0.0 --port=5000
```

Configure the existing `simatrix_db` credentials and old JWT secret in `.env`. The React frontend is unchanged and already defaults to port 5000.

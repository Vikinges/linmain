# 🚀 LINART - Инструкция по запуску

## Быстрый старт с Docker

### 1️⃣ Запуск сайта

Откройте PowerShell в папке проекта и выполните:

```powershell
# Перейти в папку проекта
cd d:\Code\linart_main_site

# Запустить Docker контейнеры
docker-compose up -d --build
```

**Что происходит:**
- Создается база данных PostgreSQL
- Запускается Next.js приложение
- Применяются миграции БД
- Сайт становится доступен

### 2️⃣ Доступ к сайту

После запуска откройте браузер:

| Страница | URL | Описание |
|----------|-----|----------|
| 🏠 Главная | http://localhost:3000 | Публичная страница |
| 🔐 Вход | http://localhost:3000/login | Страница входа |
| 👤 Дашборд | http://localhost:3000/dashboard | Пользовательский дашборд |
| ⚙️ Админ | http://localhost:3000/admin | Панель администратора |

### 3️⃣ Тестовые аккаунты

**Администратор:**
- Email: `admin@example.com`
- Пароль: `admin`
- Доступ: Полный контроль сайта

**Пользователь:**
- Email: `user@example.com`
- Пароль: `user`
- Доступ: Личный дашборд

---

## 📁 Где что редактировать

### Добавить ссылки (LinkedIn, YouTube и т.д.)

1. Войдите как админ: http://localhost:3000/login
2. Откройте: http://localhost:3000/admin
3. Перейдите: **Links & Services** (будет создана)
4. Нажмите **"Add New Link"**
5. Укажите:
   - Название (LinkedIn, YouTube)
   - URL
   - Иконку
   - Публичность

### Загрузить лого

1. Админ панель → **Content** → **Media**
2. Выберите **"Site Logo"**
3. Загрузите файл PNG/SVG
4. Лого автоматически появится на сайте

### Установить фото для Hero

1. Админ панель → **Content** → **Media**
2. Выберите **"Hero Photo"**
3. Загрузите изображение
4. Фото отобразится в первом блоке главной страницы

### Настроить медиа и фон

1. Админ панель → **Content** → **Media**
2. Настройте:
   - 🖼️ **Logo**: логотип в верхнем меню
   - 👤 **Hero Photo**: фото в первом блоке
   - 🎥 **Background**: видео, blur, opacity и fallback‑картинка

---

## 🎥 Фоновое видео

### Добавить видео на фон

1. **Админ панель** → **Content** → **Media**
2. Укажите URL видео (например, с YouTube):
   ```
   https://www.youtube.com/watch?v=VIDEO_ID
   ```
   Или загрузите свое видео
3. Настройте:
   - **Blur Amount**: 0-100% (размытие)
   - **Opacity**: 0-100% (прозрачность)
   - **Fallback Image**: Запасное изображение

### Как это работает

Видео воспроизводится на фоне в режиме loop без звука с эффектом blur. Контент сайта остается читаемым.

---

## 🐳 Управление Docker

### Просмотр логов

```powershell
# Все логи
docker-compose logs -f

# Только Next.js
docker-compose logs -f app

# Только база данных
docker-compose logs -f db
```

### Остановить сайт

```powershell
docker-compose down
```

### Перезапустить

```powershell
docker-compose restart
```

### Полная пересборка

```powershell
docker-compose down
docker-compose up -d --build
```

### Деплой + автоочистка мусора

В `deploy.sh` добавлена автоматическая очистка Docker после деплоя, чтобы освобождать место на диске.

Доступные режимы:
- `CLEANUP_LEVEL=safe` (по умолчанию) — удаляет неиспользуемые контейнеры, dangling-образы и кэш сборки.
- `CLEANUP_LEVEL=full` — удаляет все неиспользуемые образы (`docker image prune -a`).
- `CLEANUP_LEVEL=off` — без очистки.

Пример:

```bash
CLEANUP_LEVEL=full ./deploy.sh
```

### 🔄 Обновление на VPS (production)

Проект на VPS расположен по умолчанию в `/opt/linart`.

**Быстрое обновление (без ввода Google-ключей):**

```bash
cd /opt/linart
git pull origin master
docker compose --env-file .env up -d --build
docker compose exec -T web sh -lc "HOME=/tmp prisma db push --skip-generate --schema /app/prisma/schema.prisma"
```

**Полное обновление через скрипт** (попросит Google Client ID/Secret):

```bash
cd /opt/linart
./deploy.sh
```

**Откат к конкретному коммиту или тегу:**

```bash
cd /opt/linart
DEPLOY_REF=<commit-hash> ./deploy.sh
```

---

### Очистить все данные

```powershell
docker-compose down -v
```
⚠️ **Внимание**: Удаляет базу данных!

---

## 🔧 Структура проекта

```
linart_main_site/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 🏠 Главная страница
│   │   ├── login/                # 🔐 Вход
│   │   ├── dashboard/            # 👤 Дашборд
│   │   └── admin/
│   │       ├── appearance/       # 🎨 Внешний вид
│   │       ├── media/            # 📁 Медиа файлы
│   │       └── links/            # 🔗 Ссылки
│   ├── components/
│   │   └── layout/
│   │       └── background-video.tsx  # 🎥 Фоновое видео
│   └── lib/
│       └── theme-config.ts       # ⚙️ Конфиг темы
└── public/
    └── uploads/                  # 📤 Загруженные файлы
        ├── logo/
        ├── photos/
        └── videos/
```

---

## 📋 Чеклист после запуска

- [ ] Сайт открывается на http://localhost:3000
- [ ] Вход работает (admin@example.com / admin)
- [ ] Админ панель доступна
- [ ] Дашборд отображается
- [ ] Docker контейнеры запущены (`docker ps`)

---

## 🆘 Решение проблем

### Порт 3000 занят

```powershell
# Найти процесс
netstat -ano | findstr :3000

# Убить процесс (замените PID)
taskkill /PID <номер_процесса> /F
```

### База данных не подключается

```powershell
# Проверить логи
docker-compose logs db

# Пересоздать контейнеры
docker-compose down -v
docker-compose up -d --build
```

### Изменения не применяются

```powershell
# Очистить кеш Next.js
docker-compose exec app rm -rf .next
docker-compose restart app
```

---

## 🎯 Следующие шаги

1. ✅ Запустите Docker
2. ✅ Войдите в админ панель
3. 🔨 Настройте медиа и фон в **Content → Media**
4. 🔨 Добавьте ссылки в **Links**
5. 🔨 Загрузите медиа в **Media**

Готово! Сайт настраивается через админ панель без правки кода! 🚀

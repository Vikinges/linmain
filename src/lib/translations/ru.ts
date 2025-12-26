// Russian translations

import { Translations } from "./en"

export const ru: Translations = {
  hero: {
    badge: "Всегда любопытен к новому",
    name: "VLADIMIR LINARTAS",
    subtitle: "Предприниматель • Создатель • Разработчик",
    description:
      "Мне всегда интересно пробовать новое — и ещё лучше делать что-то полезное своими руками. Хорошие люди, давайте объединяться! Качество важнее количества.",
  },
  pillars: {
    business: {
      title: "Бизнес",
      description:
        "20+ лет управления разными компаниями. Собираю команды людей, которые делают, а не только говорят.",
    },
    content: {
      title: "Контент",
      description:
        "Создаю видео и материалы, которые объясняют идеи просто и ясно. Главное — быть полезным.",
    },
    tech: {
      title: "Разработка",
      description:
        "От идеи до готового продукта — люблю делать вещи своими руками. Электроника, софт, всё, что можно потрогать.",
    },
  },
  portfolio: {
    title: "Проекты",
    subtitle:
      "Онлайн-карты, встроенные демо и приватная инфраструктура — в одном месте.",
    minecraft: {
      title: "Карта сервера Minecraft",
      description:
        "<p>Мой собственный сервер для подписчиков и детей. Эта страница показывает живую карту — можно наблюдать в реальном времени, как играют другие. Нажмите на карту, чтобы открыть её во весь экран.</p><ul><li><strong>Java Edition:</strong> 85.215.32.66:25565</li><li><strong>Bedrock Edition:</strong> 85.215.32.66:19132</li></ul><p>Тестовый проект и один из моих частных DevOps-проектов.</p>",
      linkLabel: "Открыть карту",
    },
    sensorHub: {
      title: "SensorHub",
      description:
        "<p>SensorHub — малопотребляющий узел на ESP32-C3 для мониторинга качества воздуха и температуры/влажности. Логи пишутся в NDJSON, OLED просыпается по кнопке, а данные периодически отправляются в API через защищённый веб-конфиг.</p><ul><li>ESP32-C3 + I2C-сенсоры (BME280/BME680)</li><li>OLED 0,96\" (SSD1306)</li><li>Аккумулятор + солнечная панель, deep sleep</li></ul>",
      linkLabel: "Перейти к видео",
    },
    commercial: {
      title: "Commercial Hub",
      description:
        "<p>Коммерческие проекты и хостинг на hub.linart.club. Доступ только по паролю.</p>",
      linkLabel: "Открыть хаб",
    },
    placeholders: {
      mapMissing: "Добавьте ссылку на карту в админке.",
      videoMissing: "Добавьте YouTube-ссылку в админке, чтобы показать плеер.",
      lockedHint: "Частный доступ. Нужен пароль.",
      mediaMissing: "Медиа не задано.",
    },
  },
  cta: {
    primary: "Посмотреть проекты",
    secondary: "Связаться со мной",
  },
  callout: {
    title: "Давайте сотрудничать",
    description:
      "Ищу хороших людей для интересных проектов. Качество важнее количества. Если хотите вместе делать полезные вещи — пишите.",
  },
  chat: {
    title: "Чат сообщества",
    description: "Живой чат для зарегистрированных пользователей. Антиспам-лимиты включены.",
  },
  auth: {
    loginTitle: "С возвращением",
    loginSubtitle: "Войдите в аккаунт",
    registerTitle: "Создать аккаунт",
    registerSubtitle: "Зарегистрируйтесь, чтобы начать",
    continueWithGoogle: "Продолжить с Google",
    continueWithEmail: "Или войти с email",
    signupWithEmail: "Или зарегистрироваться по email",
    emailLabel: "Email",
    passwordLabel: "Пароль",
    confirmPasswordLabel: "Подтвердите пароль",
    nameLabel: "Имя (необязательно)",
    signInButton: "Войти",
    signUpButton: "Создать аккаунт",
    forgotPassword: "Забыли?",
    haveAccount: "Уже есть аккаунт?",
    noAccount: "Нет аккаунта?",
    signInLink: "Войти",
    signUpLink: "Зарегистрироваться",
    terms:
      "Регистрируясь, вы соглашаетесь с условиями использования и политикой конфиденциальности",
    errors: {
      googleData: "Не удалось войти через Google",
      invalidCredentials: "Неверный email или пароль",
      passwordLength: "Пароль должен быть не короче 8 символов",
      passwordMatch: "Пароли не совпадают",
      required: "Email и пароль обязательны",
      generic: "Произошла неожиданная ошибка",
      registrationFailed: "Регистрация не удалась",
      signInFailed:
        "Аккаунт создан, но вход не выполнен. Попробуйте войти вручную.",
    },
  },
  nav: {
    login: "Войти",
    getStarted: "Начать",
  },
  footer: {
    admin: "Админ",
    dashboard: "Панель",
    copyright: "© 2025 Vladimir Linartas. Все права защищены.",
  },
}

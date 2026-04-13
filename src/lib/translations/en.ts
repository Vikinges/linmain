// English translations

export const en = {
  hero: {
    badge: "Always curious to try new things",
    name: "LInArt Labs",
    subtitle: "Entrepreneur - Creator - Developer",
    description:
      "I've always been curious to try new things - and even better, build something useful myself. Good people, let's unite! Quality matters more than quantity.",
  },
  pillars: {
    business: {
      title: "Business",
      description:
        "20+ years managing diverse companies. Building teams of people who do, not just talk.",
    },
    content: {
      title: "Content",
      description:
        "Creating videos and materials that explain ideas simply and clearly. The main thing is to be useful.",
    },
    tech: {
      title: "Development",
      description:
        "From concept to finished product - I love building things myself. Electronics, software, anything you can touch with your hands.",
    },
  },
  portfolio: {
    title: "View Projects",
    subtitle: "Live maps, embedded demos, and private infrastructure in one place.",
    minecraft: {
      title: "Minecraft Server Map",
      description:
        "<p>My own server for subscribers and kids. This page shows the live map - you can watch in real time how others play. Click the map to open it full screen.</p><ul><li><strong>Java Edition:</strong> 85.215.32.66:25565</li><li><strong>Bedrock Edition:</strong> 85.215.32.66:19132</li></ul><p>Test project and one of my private DevOps projects.</p>",
      linkLabel: "Open Map",
    },
    sensorHub: {
      title: "SensorHub",
      description:
        "<p>SensorHub is a low-power ESP32-C3 node for air-quality and temperature/humidity monitoring. It logs NDJSON locally, wakes the OLED on button press, and periodically uploads to the API via secure web config.</p><ul><li>ESP32-C3 + I2C sensors (BME280/BME680 class)</li><li>0.96\" OLED (SSD1306)</li><li>Battery + solar, deep sleep</li></ul>",
      linkLabel: "Go to Video",
    },
    commercial: {
      title: "Commercial Hub",
      description:
        "<p>Commercial projects and hosting at hub.linart.club. Access is password-protected.</p>",
      linkLabel: "Open Hub",
    },
    qrGenerator: {
      title: "QR Generator",
      description:
        "<p>Business-ready QR codes for digital business cards, meeting check-ins, and team training flows.</p><p>Many features are free, with paid options priced like a cup of coffee.</p>",
      linkLabel: "Open QR Generator",
    },
    hostLinart: {
      title: "IoT Private Server",
      description:
        "<p>Our private multi-tenant IoT management platform. Device data stays on a server <strong>you can trust</strong> — not in a random cloud. Hosted locally in Bavaria, cooled by Alpine breeze 🏔️</p><h3>Plans</h3><ul><li>🎁 <strong>Hardware buyers</strong> — 1 year FREE</li><li>⚡ <strong>Geeks</strong> — from 1.99€/month</li><li>🏢 <strong>B2B Cloud</strong> — from 49€/month</li><li>🏆 <strong>Enterprise</strong> — Custom</li></ul><p><strong>🎉 Welcome, first buyers!</strong> Those who purchased our hardware receive free annual server access — because you'll witness something rare: <strong>extreme updates appearing every single day.</strong> New features and possibilities emerge in real time. You're not just customers — you're co-creators. We listen to your ideas, pick the most interesting ones, and build them — sometimes the very next day. Like the first Apple customers, you were there from day one. That story is worth something.</p>",
      linkLabel: "View Plans",
    },
    crmIot: {
      title: "CRM-IoT — Smart Rental Automation",
      description:
        "<p style='display:inline-flex;align-items:center;gap:6px;padding:3px 12px;border-radius:99px;border:1px solid rgba(249,115,22,0.4);background:rgba(249,115,22,0.1);color:#fb923c;font-size:0.85em;margin-bottom:12px'>🚧 In Development — registration not yet open</p><p>B2B platform for <strong>hotels, holiday homes, and apartments</strong> that want to monetize property more efficiently through IoT infrastructure.</p><ul><li>Automated check-in/check-out via smart locks</li><li>Fingerprint scanner + keypad + NFC + wireless keys</li><li>Online mode (CRM sync) + Offline mode (pre-loaded codes)</li><li>Protected by our private European IoT infrastructure</li></ul><p>Already accepting applications — order an electronic door lock at early-adopter pricing. We contact you personally.</p>",
      ctaTitle: "Request a Smart Lock",
      ctaDescription:
        "Electronic door lock with fingerprint scanner, digital keypad, NFC and wireless keys. First orders at early-adopter pricing.",
      ctaButton: "Submit Request",
      linkLabel: "Submit Request",
    },
    cloud: {
      title: "Private Cloud Services",
      description:
        "<p>For those we trust — and who trust us. Your data stays on our server <strong>in Bavaria, Germany</strong>, cooled by real Alpine air 🏔️ — not in an American data center. We never analyze your data or sell your preferences.</p><p><strong>📷 Immich</strong> — self-hosted alternative to Google Photos. AI search, face recognition, albums — your photos never leave our server.<br><a href='https://photo.linart.club' style='color:#93c5fd'>photo.linart.club</a></p><p><strong>☁️ Nextcloud</strong> — personal cloud: files, calendar, contacts, documents. Like Dropbox — but private, in Europe, yours.<br><a href='https://cloud.crm-iot.com' style='color:#93c5fd'>cloud.crm-iot.com</a></p><p>Access by invitation. Write to us if you want in.</p>",
    },
    entertainment: {
      title: "Entertainment",
      subtitle: "Projects for fun and experiments",
    },
    placeholders: {
      mapMissing: "Add a map embed URL in Admin.",
      videoMissing: "Add a YouTube video link in Admin to show the player.",
      lockedHint: "Private access. Password required.",
      mediaMissing: "Media not set.",
    },
  },
  cta: {
    primary: "View Projects",
    secondary: "Contact Me",
  },
  callout: {
    title: "Let's Team Up",
    description:
      "Looking for good people for interesting projects. Quality matters more than quantity. If you're interested in building useful things together - let's connect!",
  },
  chat: {
    title: "Community Chat",
    description: "Live chat for registered users. Anti-spam limits are active.",
  },
  auth: {
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to your account",
    registerTitle: "Create Account",
    registerSubtitle: "Sign up to get started",
    continueWithGoogle: "Continue with Google",
    continueWithEmail: "Or continue with email",
    signupWithEmail: "Or sign up with email",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    nameLabel: "Name (optional)",
    signInButton: "Sign In",
    signUpButton: "Create Account",
    forgotPassword: "Forgot?",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    signInLink: "Sign in",
    signUpLink: "Sign up",
    terms: "By signing up, you agree to our Terms of Service and Privacy Policy",
    errors: {
      googleData: "Failed to sign in with Google",
      invalidCredentials: "Invalid email or password",
      passwordLength: "Password must be at least 8 characters",
      passwordMatch: "Passwords do not match",
      required: "Email and password are required",
      generic: "An unexpected error occurred",
      registrationFailed: "Registration failed",
      signInFailed:
        "Account created but sign in failed. Please try logging in.",
    },
  },
  nav: {
    login: "Login",
    getStarted: "Get Started",
  },
  footer: {
    admin: "Admin",
    dashboard: "Dashboard",
    copyright: "(c) 2025 Vladimir Linartas. All rights reserved.",
  },
}

export type Translations = typeof en

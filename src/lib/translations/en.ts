// English translations

export const en = {
    hero: {
        badge: "Always curious to try new things",
        name: "VLADIMIR LINARTAS",
        subtitle: "Entrepreneur • Creator • Developer",
        description: "I've always been curious to try new things, and even better — build something useful myself. Good people, let's unite! Quality matters more than quantity."
    },
    pillars: {
        business: {
            title: "Business",
            description: "20+ years managing diverse companies. Building teams of people who do, not just talk."
        },
        content: {
            title: "Content",
            description: "Creating videos and materials that explain ideas simply and clearly. The main thing — to be useful."
        },
        tech: {
            title: "Development",
            description: "From concept to finished product — I love building things myself. Electronics, software, anything you can touch with your hands."
        }
    },
    portfolio: {
        title: "View Projects",
        subtitle: "Live maps, embedded demos, and private infrastructure in one place.",
        minecraft: {
            title: "Minecraft Server Map",
            description: "My own server for subscribers and kids. This page shows the live map so you can watch in real time how others play. Click the map to open it full screen. Java Edition: IP 85.215.32.66:25565. Bedrock Edition: IP 85.215.32.66:19132. A test project and one of my private DevOps builds.",
            linkLabel: "Open Map"
        },
        sensorHub: {
            title: "SensorHub",
            description: "SensorHub is a hardware + firmware project for smart-things hosting: a low-power ESP32-C3 node with air-quality and temperature/humidity sensors. OLED on button press, local JSON log, secure web config, and periodic uplink to the API.",
            linkLabel: "YouTube Channel"
        },
        commercial: {
            title: "Commercial Hub",
            description: "Commercial projects and hosting at hub.linart.club. Access is password-protected.",
            linkLabel: "Open Hub"
        },
        placeholders: {
            mapMissing: "Add a map embed URL in Admin.",
            videoMissing: "Add a YouTube video link in Admin to show the player.",
            lockedHint: "Private access. Password required."
        }
    },
    cta: {
        primary: "View Projects",
        secondary: "Contact Me"
    },
    callout: {
        title: "Let's Team Up 🤝",
        description: "Looking for good people for interesting projects. Quality matters more than quantity. If you're interested in building useful things together — let's connect!"
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
            signInFailed: "Account created but sign in failed. Please try logging in."
        }
    },
    nav: {
        login: "Login",
        getStarted: "Get Started"
    },
    footer: {
        admin: "Admin",
        dashboard: "Dashboard",
        copyright: "© 2025 Vladimir Linartas. All rights reserved."
    }
}

export type Translations = typeof en

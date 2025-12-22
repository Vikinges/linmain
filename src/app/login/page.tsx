"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, getProviders } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock } from "lucide-react"
import { loadLanguage } from "@/lib/i18n-config"
import { getTranslations } from "@/lib/translations"

type AuthProviders = Record<string, { id: string; name?: string }>

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [providers, setProviders] = useState<AuthProviders | null>(null)
    const [t] = useState(() => getTranslations(loadLanguage()))

    useEffect(() => {
        getProviders().then(setProviders).catch(() => setProviders(null))
    }, [])

    const handleGoogleSignIn = async () => {
        if (!providers?.google) {
            setError(t.auth.errors.googleData)
            return
        }
        setIsLoading(true)
        try {
            await signIn("google", { callbackUrl: "/dashboard" })
        } catch {
            setError(t.auth.errors.googleData)
            setIsLoading(false)
        }
    }

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false
            })

            if (result?.error) {
                setError(t.auth.errors.invalidCredentials)
                setIsLoading(false)
            } else {
                router.push("/dashboard")
            }
        } catch {
            setError(t.auth.errors.generic)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Linart"
                            width={48}
                            height={48}
                        />
                        <span className="text-2xl font-bold text-white">LINART</span>
                    </Link>
                </div>

                <Card className="glass-card border-white/20">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">{t.auth.loginTitle}</CardTitle>
                        <CardDescription className="text-gray-400">
                            {t.auth.loginSubtitle}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Google Sign In */}
                        {providers?.google && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-white/20 hover:bg-white/10"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {t.auth.continueWithGoogle}
                            </Button>
                        )}

                        {providers?.google && (
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-gray-900 px-2 text-gray-400">
                                        {t.auth.continueWithEmail}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Email Sign In Form */}
                        <form onSubmit={handleEmailSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">{t.auth.emailLabel}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-10 bg-white/5 border-white/20 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-300">{t.auth.passwordLabel}</Label>
                                    <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white">
                                        {t.auth.forgotPassword}
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="********"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-10 bg-white/5 border-white/20 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t.auth.signInButton}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-gray-400">
                            {t.auth.noAccount}{" "}
                            <Link href="/register" className="text-gray-200 hover:text-white underline">
                                {t.auth.signUpLink}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}


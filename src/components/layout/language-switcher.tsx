"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronDown, Globe } from "lucide-react"
import { Language, languages, getLanguageFlag, saveLanguage } from "@/lib/i18n-config"

interface LanguageSwitcherProps {
    currentLanguage: Language
    onLanguageChange: (language: Language) => void
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
    const currentLang = languages.find(l => l.code === currentLanguage)

    const handleLanguageChange = (code: Language) => {
        saveLanguage(code)
        onLanguageChange(code)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
                    <span className="sm:hidden">{currentLang?.flag}</span>
                    <ChevronDown className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-3"
                    >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="flex-1">{lang.name}</span>
                        {currentLanguage === lang.code && (
                            <Check className="h-4 w-4 text-green-400" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

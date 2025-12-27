"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  href?: string
  label?: string
  logoUrl?: string
  size?: number
  subLabel?: string
  className?: string
  labelClassName?: string
  subLabelClassName?: string
}

export function BrandLogo({
  href = "/",
  label = "LINART",
  logoUrl = "/logo.png",
  size = 40,
  subLabel,
  className,
  labelClassName,
  subLabelClassName,
}: BrandLogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-3 group", className)}>
      <Image
        src={logoUrl}
        alt={`${label} logo`}
        width={size}
        height={size}
        className="transition-transform group-hover:scale-105"
      />
      <div className="flex flex-col leading-none">
        <span className={cn("text-xl font-bold text-gray-200 tracking-wide", labelClassName)}>
          {label}
        </span>
        {subLabel && (
          <span className={cn("text-xs text-gray-400", subLabelClassName)}>
            {subLabel}
          </span>
        )}
      </div>
    </Link>
  )
}

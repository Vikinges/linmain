"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface BackgroundVideoProps {
    videoUrl?: string
    blurAmount?: number
    opacity?: number
    fallbackImage?: string
    className?: string
}

export function BackgroundVideo({
    videoUrl = "",
    blurAmount = 20,
    opacity = 50,
    fallbackImage = "",
    className
}: BackgroundVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoLoaded, setVideoLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        if (videoRef.current && videoUrl) {
            videoRef.current.load()
        }
    }, [videoUrl])

    if (!videoUrl && !fallbackImage) {
        return null
    }

    return (
        <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
            {/* Fallback Image or Gradient */}
            {(fallbackImage || !videoUrl || hasError) && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: fallbackImage
                            ? `url(${fallbackImage})`
                            : 'linear-gradient(to bottom right, #0f172a, #1e293b, #334155)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: `blur(${blurAmount}px)`,
                        opacity: opacity / 100
                    }}
                />
            )}

            {/* Video Background */}
            {videoUrl && !hasError && (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onLoadedData={() => setVideoLoaded(true)}
                        onError={() => {
                            setHasError(true)
                            // Only warn if it's not a blob URL (blobs expire on reload)
                            if (videoUrl && !videoUrl.startsWith('blob:')) {
                                console.warn('Background video failed to load:', videoUrl)
                            }
                        }}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            filter: `blur(${blurAmount}px)`,
                            opacity: videoLoaded ? opacity / 100 : 0,
                            transition: 'opacity 1s ease-in-out'
                        }}
                    >
                        <source src={videoUrl} type="video/mp4" />
                        <source src={videoUrl} type="video/webm" />
                    </video>

                    {/* Dark Overlay for better text readability */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        style={{ opacity: opacity / 100 }}
                    />
                </>
            )}

            {/* Noise Texture Overlay for premium look */}
            <div
                className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
                }}
            />
        </div>
    )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileHeaderProps {
    name: string
    bio: string
    image: string
}

export function ProfileHeader({ name, bio, image }: ProfileHeaderProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 mb-8 text-center bg-transparent">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background relative">
                    <AvatarImage src={image} alt={name} className="object-cover" />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {name}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {bio}
                </p>
            </div>
        </div>
    )
}

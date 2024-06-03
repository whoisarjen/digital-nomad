import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link"
  
export const Navbar = () => {
    return (
        <div className="flex justify-between container items-center p-4 box-border">
            <Link href="/">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>
        </div>
    )
}

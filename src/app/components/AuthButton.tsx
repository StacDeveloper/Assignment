import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import React from 'react'
import { supabase } from '../configs/supabase'
import Image from 'next/image'
import { LogIn, LogOut } from 'lucide-react'


const AuthButton: React.FC<{ user: User | null }> = ({ user }) => {
    const router = useRouter()

    const handleSignIn = async () => {
        console.log(window.location.origin)
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
        window.location.reload()
    }
    if (user) {
        return (
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-3'>
                    {user.user_metadata.avatar_url && (
                        <Image
                            src={user.user_metadata.avatar_url}
                            alt='user-profile'
                            width={32}
                            height={32}
                            className='rounded-full'
                        />
                    )}
                    <div className='hidden sm:block'>
                        <p className='text-sm font-medium text-gray-900'>
                            {user.user_metadata.full_name || user.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className='flex items-center gap-2 px-4 py-4 bg-gradient-to-bl from-blue-500 to-violet-300 text-sm font-medium text-gray-700  border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'
                >
                    <LogOut className='w-4 h-4' /> Sign Out
                </button>
            </div>
        )

    } else {
        return (
            <button
            onClick={handleSignIn}
            className='flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-violet-600 hover:from-blue-800 hover:to-violet-800 rounded-lg hover:bg-blue-700 transition-colors'
            >   
            <Image src={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/960px-Google_Favicon_2025.svg.png"} height={30} width={30} alt='Google_Image'/> Sign in with Google
            <LogIn className='w-4 h-4'/>
            </button>
        )
    }
}

export default AuthButton
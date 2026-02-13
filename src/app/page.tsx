"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from './configs/supabase'
import { Bookmark } from 'lucide-react'
import AuthButton from './components/AuthButton'
import { User } from '@supabase/supabase-js'
import BookmarkForm from './components/BookmarkForm'
import BookmarkList  from './components/BookmarkList'
import toast, { Toaster } from 'react-hot-toast'


export default function HomePage() {
  const [user, Setuser] = useState<User | null>(null)
  const [loading, SetLoading] = useState<boolean>(false)
  const [bookmark, setbookmark] = useState<any[]>([])
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      Setuser(user)
    }
    getUser()
  }, [])

  const fetchBookMarks = async () => {
    SetLoading(true)
    try {
      const { data, error } = await supabase.from("bookmarks").select("*").eq("user_id", user?.id).order("created_at", { ascending: false })
      if (error) console.log(error)
      setbookmark(data as any)
      console.log(user)
    } catch (error: any) {
      console.log(error)
      toast.error(error)
    } finally {
      SetLoading(false)
    }
  }

  useEffect(() => {
    fetchBookMarks()
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <Toaster />
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-600 p-2 rounded-lg'>
                <Bookmark className='w-6 h-6 text-white' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900'>Smart Bookmarks</h1>
            </div>
            {user && (
              <AuthButton user={user} />
            )}

          </div>
        </div>
      </header>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {user ? (
          // Welcome Section
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                Welcome back, {user.user_metadata.full_name || 'there'}! 👋
              </h2>
              <p className='text-gray-600'>
                Manage your personal bookmarks collection. All bookmarks are private to your account.
              </p>
            </div>
            {/* Bookmark Section */}
            <BookmarkForm userId={user.id} />
            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                Your Bookmarks
                <BookmarkList userId={user.id} />
                
              </h2>
            </div>
          </div>
        ) : (
          <div className='max-w-md mx-auto mt-12'>
            <div className='bg-white rounded-lg shadow-md p-8 text-center border border-gray-200'>
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4'>
                <Bookmark className='w-8 h-8 text-blue-600' />
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-3'>Welcome to Smart Bookmarks</h2>
              <p className='text-gray-500'>Your personal bookmark manager with real-time sync. Sign in with Google to get started</p>
            </div>
            <div className='flex mx-auto mt-4 ml-24 lg:ml-30 md:ml-25 sm:ml-24  transition transition-all'>
              <AuthButton user={null} />
            </div>
          </div>
        )}
      </div>


    </div>
  )
}


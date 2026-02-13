"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { supabase } from '../configs/supabase'
import { Calendar, ExternalLink, Trash2Icon } from 'lucide-react'
import Link from 'next/link'

 interface bookmark {
    id: string
    title: string
    url: string
    created_at: string
    user_id: string
}

const BookmarkList: React.FC<{ userId: string }> = (
    { userId }
) => {


    const [bookmarks, SetBookMarks] = useState<bookmark[]>([])
    const [loading, SetLoading] = useState<boolean>(false)

    const fetchBookMarks = async () => {
        SetLoading(true)
        try {
            const { data, error } = await supabase.from("bookmarks").select("*").eq("user_id", userId).order("created_at", { ascending: false })
            console.log(data)
            if (error) console.log(error)
            SetBookMarks(data || [])
        } catch (error: any) {
            console.log(error)
            toast.error(error)
        } finally {
            SetLoading(false)
        }
    }


    useEffect(() => {
        fetchBookMarks()
        const channel: RealtimeChannel = supabase.channel("bookmarks-changes").on(
            'postgres_changes', {
            event: '*',
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${userId}`,
        }, (payload) => {
            if (payload.eventType === "INSERT") {
                SetBookMarks((current) => [payload.new as bookmark, ...current])
            } else if (payload.eventType === "DELETE") {
                SetBookMarks((current) => current.filter((bk) => bk.id !== payload.old.id))
            } else if (payload.eventType === "UPDATE") {
                SetBookMarks((current) => current.map((bk) => bk.id === payload.new.id ? (payload.new as bookmark) : bk))
            }
        }
        ).subscribe()
        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bookmark")) return
        try {
            const { error } = await supabase.from('bookmarks').delete().eq("id", id)
            if (error) console.log(error)
            fetchBookMarks()
            toast.success("Deleted Bookmark")
        } catch (error: any) {
            console.log(error)
            toast.error(error)
        }
    }

    const formDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'>
                </div>
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className='text-center py-12'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4'>
                    <ExternalLink className='w-8 h-8 text-gray-400' />
                </div>
                <h3 className=''>No Bookmarks Yet</h3>
                <p className='text-gray-500'>Get started by building adding your first bookmark!</p>
            </div>
        )
    }
    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {bookmarks.map((bk) => (
                <div
                    key={bk.id}
                    className='bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow group p-5'>
                    <div className='flex items-start justify-between mb-3 flex-col'>
                        <h3 className='text-base font-semibibold text-gray-900 line-clamp-2 flex-1 pr-2'>{bk.title}
                        </h3>
                        <button
                            onClick={() => handleDelete(bk.id)}
                            className='text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100'
                            title='Delete Bookmark'
                        ><Trash2Icon className='w-4 h-4' />
                        </button>

                        <Link
                            href={bk.url}
                            target='_blank'
                            rel="noopener noreferrer"
                            className='text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 mb-3 break-all'
                        >
                            <ExternalLink className='w-3 h-3 flex-shrink-0' />
                            <span className='line-clamp-1'>{bk.url}</span>
                        </Link>
                        <div className='flex items-center gap-1 text-xs text-gray-500'>
                            <Calendar className='w-3 h-3' />
                            <span>{formDate(bk.created_at)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BookmarkList
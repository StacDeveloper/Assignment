"use client"
import { Plus, X } from 'lucide-react'
import React from 'react'
import { useState } from "react"
import toast from 'react-hot-toast'
import { supabase } from '../configs/supabase'

const BookmarkForm: React.FC<{ userId: string }> = ({ userId }) => {

    const [isOpen, setisOpen] = useState<boolean>(false)
    const [url, SetUrl] = useState<string>("")
    const [title, SetTitle] = useState<string>("")
    const [loading, SetLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.SubmitEvent) => {
        console.log("handlesubmit")
        e.preventDefault()
        if (!url.trim() || !title.trim()) return

        SetLoading(true)
        try {
            const { error } = await supabase.from('bookmarks').insert([
                {
                    url: url.trim(),
                    title: title.trim(),
                    user_id: userId
                }
            ])
            if (error) console.log(error)
            SetUrl("")
            SetTitle("")
            setisOpen(false)
        } catch (error: any) {
            console.log(error)
            toast.error(error)
        } finally {
            SetLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setisOpen(true)}
                className='flex items-center gap-2 px-2 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm'
            >
                <Plus className='w-4 h-4' />
                Add Bookmark
            </button>
        )
    }

    return (
        <div className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                    Add New Bookmark
                </h3>
                <button
                    onClick={() => setisOpen(false)}
                    className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                    <X className='w-5 h-5' />
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className='space-y-4'
            >
                <div>
                    <label
                        htmlFor="title"
                        className='block text-sm font-medium text-gray-700 mb-1'
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id='title'
                        value={title}
                        onChange={(e) => SetTitle(e.target.value)}
                        placeholder='My awesome bookmark'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500  outline-none text-black'
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="url"
                        className='block text-sm font-medium text-gray-700 mb-1'
                    >
                        Url
                    </label>
                    <input
                        type="text"
                        id='url'
                        value={url}
                        onChange={(e) => SetUrl(e.target.value)}
                        placeholder='Please provide url for your bookmarks'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500  outline-none text-black'
                        required
                    />
                </div>

                <div className='flex gap-3'>
                    <button
                        type='submit'
                        disabled={loading}
                        className='flex-1 px-4 py-2 text-sm font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? "Addin..." : "Add Bookmark"}
                    </button>
                    <button
                        type='button'
                        onClick={() => setisOpen(false)}
                        className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transiton-colors'
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default BookmarkForm
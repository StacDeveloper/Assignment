"use client"
import { Plus, X } from "lucide-react"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { supabase } from "../configs/supabase"

interface Props {
  userId: string
}

const BookmarkForm: React.FC<Props> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    setLoading(true)

    try {
      const { error } = await supabase.from("bookmarks").insert([
        {
          title: title.trim(),
          url: url.trim(),
          user_id: userId,
        },
      ])

      if (error) throw error

      toast.success("Bookmark added 🚀")

      setTitle("")
      setUrl("")
      setIsOpen(false)

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus className="w-4 h-4" />
        Add Bookmark
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add New Bookmark</h3>
        <button onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-black"
          required
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-black"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookmarkForm

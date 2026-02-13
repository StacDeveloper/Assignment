"use client"
import React, { useEffect, useState } from "react"
import { supabase } from "../configs/supabase"
import { Calendar, ExternalLink, Trash2 } from "lucide-react"
import { RealtimeChannel } from "@supabase/supabase-js"
import toast from "react-hot-toast"
import Link from "next/link"

export interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

interface Props {
  userId: string
}

const BookmarkList: React.FC<Props> = ({ userId }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()

    const channel: RealtimeChannel = supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          }
          if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            )
          }
          if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id
                  ? (payload.new as Bookmark)
                  : b
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bookmark?")) return

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

    if (error) toast.error(error.message)
    else toast.success("Deleted")
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (bookmarks.length === 0) {
    return <div className="text-center py-8">No bookmarks yet.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bk) => (
        <div
          key={bk.id}
          className="bg-white rounded-lg shadow border p-5"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">{bk.title}</h3>
            <button onClick={() => handleDelete(bk.id)}>
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
            </button>
          </div>

          <Link
            href={bk.url}
            target="_blank"
            className="text-sm text-blue-600 flex items-center gap-1 mt-2"
          >
            <ExternalLink className="w-3 h-3" />
            {bk.url}
          </Link>

          <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
            <Calendar className="w-3 h-3" />
            {new Date(bk.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default BookmarkList

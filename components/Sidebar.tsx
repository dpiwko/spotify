import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useSpotify } from '../hooks/useSpotify'

interface ISpotifyApiPlaylist {
  id: string
  name: string
}

export const Sidebar = () => {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState<ISpotifyApiPlaylist[]>([])
  const [playlistId, setPlaylistId] = useState<string>('')
  console.log(
    '🚀 ~ file: Sidebar.tsx ~ line 22 ~ Sidebar ~ playlistId',
    playlistId
  )

  useEffect(() => {
    if (spotifyApi?.getAccessToken())
      spotifyApi.getUserPlaylists({ limit: 50 }).then((data) => {
        setPlaylists(data?.body?.items)
      })
  }, [session, spotifyApi])

  return (
    <div className="h-screen overflow-y-scroll border-r border-gray-900 p-5 text-sm text-gray-500 scrollbar-hide">
      <div className="space-y-4">
        <button
          className="hover:text-red flex items-center space-x-2"
          onClick={() => signOut()}
        >
          <p>Log out</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* playlists */}
        {playlists?.map((playlist) => (
          <p
            key={playlist?.id}
            className="cursor-pointer hover:text-white"
            onClick={() => setPlaylistId(playlist.id)}
          >
            {playlist?.name}
          </p>
        ))}
      </div>
    </div>
  )
}

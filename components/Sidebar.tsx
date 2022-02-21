import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  SearchIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { playlistIdState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'

export default function Sidebar() {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([])
  const [playlistId, setPlaylistId] = useRecoilState<string>(playlistIdState)

  useEffect(() => {
    spotifyApi.getUserPlaylists({ limit: 50 }).then((data) => {
      setPlaylists(data?.body?.items)
    })
  }, [session, spotifyApi])

  return (
    <div className="hidden border-r border-gray-900 p-5 text-sm text-gray-500 sm:w-[12rem] md:inline-flex lg:w-[15rem] lg:text-sm xl:w-[20rem]">
      <div className="space-y-4">
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
        <hr className="border-t-[0.1px] border-gray-900" />

        <div className="h-screen space-y-4 overflow-y-scroll pb-[22rem] scrollbar-hide">
          {playlists?.map((playlist) => (
            <p
              key={playlist?.id}
              className="cursor-pointer truncate hover:text-white sm:max-w-[8rem] lg:max-w-[11rem] xl:max-w-[16rem]"
              onClick={() => setPlaylistId(playlist?.id)}
            >
              {playlist?.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

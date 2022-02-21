import { ChevronDownIcon } from '@heroicons/react/outline'
import { shuffle } from 'lodash'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

export default function Center() {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState<string>('')
  const playlistId = useRecoilValue<string>(playlistIdState)
  const [playlist, setPlaylist] =
    useRecoilState<SpotifyApi.SinglePlaylistResponse>(playlistState)

  useEffect(() => {
    const randomColor = shuffle(colors)?.pop() as string
    setColor(randomColor)
  }, [playlistId])

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then((data) => {
      setPlaylist(data?.body)
    })
  }, [spotifyApi, playlistId])

  return (
    <div className="relative h-screen flex-grow overflow-y-scroll text-white scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 opacity-90 hover:opacity-80"
          onClick={() => signOut()}
        >
          <img
            src={session?.user?.image as string}
            alt="avatar"
            className="w-190 h-10 rounded-full"
          />
          <p>{session?.user?.name}</p>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b to-black p-8 pb-12 ${color}`}
      >
        <img
          src={playlist?.images?.at(0)?.url}
          alt={playlist?.name}
          className="h-52 w-52 shadow-2xl"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="mt-4 text-3xl font-bold md:text-6xl xl:text-9xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <Songs />
    </div>
  )
}

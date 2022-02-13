import { ChevronDownIcon } from '@heroicons/react/outline'
import { shuffle } from 'lodash'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

export const Center = () => {
  const { data: session } = useSession()
  const [color, setColor] = useState<string>('')

  useEffect(() => {
    const randomColor = shuffle(colors)?.pop() as string
    setColor(randomColor)
  }, [])

  return (
    <div className="flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 opacity-90 hover:opacity-80">
          <img
            src={session?.user?.image}
            alt="avatar"
            className="w-190 h-10 rounded-full"
          />
          <p>{session?.user?.name}</p>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`padding-8 flex h-80 items-end space-x-2 bg-gradient-to-b to-black ${color}`}
      ></section>
    </div>
  )
}

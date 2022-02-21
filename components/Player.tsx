import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeOffIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'

type RepeatState = 'off' | 'context' | 'track'
const repeatStateArr: RepeatState[] = ['off', 'context', 'track']

export default function Player() {
  const spotifyApi = useSpotify()
  const songInfo = useSongInfo()
  const { data: session } = useSession()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState<number>(50)
  const [isShuffle, setIsShuffle] = useState<boolean>(false)
  const [repeatState, setRepeatState] = useState(repeatStateArr[0])
  const [repeatStateIndex, setRepeatStateIndex] = useState(0)

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id as string)
      })

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing)
      })
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      data.body.is_playing ? spotifyApi.pause() : spotifyApi.play()

      setIsPlaying(!data.body.is_playing)
    })
  }

  const handlePrevSong = () => {
    spotifyApi.skipToPrevious()
  }

  const handleNextSong = () => {
    spotifyApi.skipToNext()
  }

  const handleRepeat = () => {
    setRepeatStateIndex((repeatStateIndex + 1) % repeatStateArr.length)
    setRepeatState(repeatStateArr[repeatStateIndex])
    spotifyApi.setRepeat(repeatStateArr[repeatStateIndex])
  }

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => {
        console.error(error)
      })
    }, 250),
    []
  )

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      fetchCurrentSong()
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  useEffect(() => {
    spotifyApi.setShuffle(isShuffle)
  }, [isShuffle])

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-white md:px-8 md:text-base">
      {/* LEFT */}
      <div className="flex items-center space-x-4">
        <img
          src={songInfo?.album.images?.at(0)?.url}
          className="hidden h-14 w-14 md:inline"
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-xs text-gray-500 md:text-sm">
            {songInfo?.artists?.map((artist) => artist.name).join(', ')}
          </p>
        </div>
        <HeartIcon className="button" onClick={() => console.log('fav')} />
      </div>

      {/* CENTER */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon
          className={`button ${isShuffle && 'text-green-500'}`}
          onClick={() => setIsShuffle(!isShuffle)}
        />
        <RewindIcon className="button" onClick={handlePrevSong} />

        {isPlaying ? (
          <PauseIcon className="button h-12 w-12" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="button h-12 w-12" onClick={handlePlayPause} />
        )}

        <FastForwardIcon className="button" onClick={handleNextSong} />
        <span className="relative">
          <ReplyIcon
            className={`button ${repeatStateIndex !== 0 && 'text-green-500'}`}
            onClick={handleRepeat}
          />
          {repeatStateIndex === 2 && (
            <span className="absolute top-[-8px] right-0 text-[.6rem] text-green-500">
              1
            </span>
          )}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        {volume === 0 ? (
          <VolumeOffIcon className="button" onClick={() => setVolume(50)} />
        ) : (
          <VolumeDownIcon
            className="button"
            onClick={() => volume > 0 && setVolume(volume - 10)}
          />
        )}
        <input
          type="range"
          value={volume}
          min={0}
          max={100}
          className="w-14 md:w-28"
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  )
}

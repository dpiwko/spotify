import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentTrackIdState } from '../atoms/songAtom'
import useSpotify from './useSpotify'

export default function useSongInfo() {
  const spotifyApi = useSpotify()
  const currentTrackId = useRecoilValue(currentTrackIdState)
  const [songInfo, setSongInfo] = useState<SpotifyApi.SingleTrackResponse>()

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        await spotifyApi.getTrack(currentTrackId).then((track) => {
          setSongInfo(track.body)
        })
      }
    }

    fetchSongInfo()
  }, [currentTrackId, spotifyApi])

  return songInfo
}

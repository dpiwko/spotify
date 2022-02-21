import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song'

export default function Songs() {
  const playlist = useRecoilValue(playlistState)

  return (
    <div className="flex flex-col px-8 pb-20">
      {playlist?.tracks?.items?.map(
        ({ track }: SpotifyApi.PlaylistTrackObject, index) => (
          <Song
            key={track.id}
            order={index}
            track={track}
            playlist={playlist.tracks.items}
          />
        )
      )}
    </div>
  )
}

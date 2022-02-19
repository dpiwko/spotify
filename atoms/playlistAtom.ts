import { atom } from 'recoil'

export const playlistState = atom({
  key: 'playlistState',
  default: {} as SpotifyApi.SinglePlaylistResponse,
})

export const playlistIdState = atom({
  key: 'playlistIdState',
  default: '37i9dQZEVXcNt9wX5kYduG',
})

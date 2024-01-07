import { AlbumModel } from "@core/models/album.model";

export interface StateCurrenSong {
  album: AlbumModel,
  idx: number,
  state: boolean
}

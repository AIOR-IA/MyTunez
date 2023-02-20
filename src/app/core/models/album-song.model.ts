import {GenreModel} from "./genre.model";
import {SongProgressModel} from "./song-progress.model";

export interface AlbumSongModel {
  albumUUID: string;
  title: string;
  genre: GenreModel;
  year: string;
  imageCover: string; //urlPublic
  songs: Array<SongProgressModel>
}

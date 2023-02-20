import {GenreModel} from "./genre.model";

export interface SongProgressModel {
  songUUID: string;
  title: string;
  genre: GenreModel;
  year: string;
  duration: string;
  linkSong: string; //urlPublic
  albumUUID: string;

  songProgress: string;  // 2:03
  songState: string // play  or stop
}

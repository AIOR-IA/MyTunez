import {GenreModel} from "./genre.model";

export interface SongModel {
  songUUID: string;
  title: string;
  genre: GenreModel;
  year: string;
  duration: string;
  linkSong: string; //urlPublic
  albumUUID: string;
}

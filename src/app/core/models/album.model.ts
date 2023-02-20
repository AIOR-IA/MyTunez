import {GenreModel} from "./genre.model";

export interface AlbumModel {
  albumUUID: string;
  title: string;
  genre: GenreModel;
  year: string;
  imageCover: string; //urlPublic
  artistUUID: string;
}

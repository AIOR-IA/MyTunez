import {GenreModel} from "./genre.model";

export interface ArtistModel {
  artistUUID: string;
  name: string;
  genres: Array<GenreModel>;
  members: string;
  website: string
  image: string; // urlPublic
}

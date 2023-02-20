import {Injectable} from '@angular/core';
import {LocalstorageService} from "./localstorage.service";

import {v4 as uuidv4} from 'uuid';
import {ArtistModel} from '@core/models/artist.model';
import {AlbumModel} from '@core/models/album.model';
import {SongModel} from '@core/models/song.model';
import {GenreModel} from '@core/models/genre.model';
import {AlbumSongModel} from '@core/models/album-song.model';
import {SongProgressModel} from '@core/models/song-progress.model';


import * as dataArtist from '../../data/artist.json';
import * as dataAlbum from '../../data/album.json';
import * as dataSong from '../../data/song.json';

@Injectable({
  providedIn: 'root'
})
export class BusinessLogicService {

  public artistCollection: Array<ArtistModel> = [];
  public albumCollection: Array<AlbumModel> = [];
  public songCollection: Array<SongModel> = [];
  public genreCollection: Array<GenreModel> = [];
  public keyArtists = "artists"
  public keyAlbums = "albums";
  public keySongs = "songs"
  public keyGenres = "genres";

  public songProgressInit: string = "00:00"

  constructor(private localstorageService: LocalstorageService) {
    this.setDefaultMusicGenres();
    this.SetDataDefault();
    this.artistCollection = this.getContextCollection(this.keyArtists);
    this.albumCollection = this.getContextCollection(this.keyAlbums);
    this.songCollection = this.getContextCollection(this.keySongs);
    this.genreCollection = this.getContextCollection(this.keyGenres);
  }

  setDefaultMusicGenres() {
    let genres: Array<GenreModel> = [];
    genres = [
      {
        genreUUID: "G-1",
        name: "Rock"
      },
      {
        genreUUID: "G-2",
        name: "Jazz"
      },
      {
        genreUUID: "G-3",
        name: "Blues"
      },
      {
        genreUUID: "G-4",
        name: "Tecno"
      },
      {
        genreUUID: "G-5",
        name: "Metal"
      },
    ];
    this.localstorageService.setCollection(this.keyGenres, JSON.stringify(genres));
  }

  getContextCollection(keyValue: string) {
    let contextRecordsLocalstorage: string | null;
    contextRecordsLocalstorage = this.localstorageService.getCollection(keyValue);
    if (contextRecordsLocalstorage == null) {
      return [];
    } else {
      return JSON.parse(contextRecordsLocalstorage);
    }
  }

  getAlbums(artistUUID: string) {
    let currentAlbums: Array<AlbumModel> = [];
    currentAlbums = this.albumCollection.filter(artist => artist.artistUUID == artistUUID);
    return currentAlbums;
  }

  getSongs(albumUUID: string) {
    let currentSongs: Array<SongModel> = [];
    currentSongs = this.songCollection.filter(song => song.albumUUID == albumUUID);
    return currentSongs;
  }

  addArtist(artist: ArtistModel) {
    console.log("here = ", this.artistCollection)
    this.artistCollection.push(artist);
    this.localstorageService.setCollection(this.keyArtists, JSON.stringify(this.artistCollection));
    this.artistCollection = this.getContextCollection(this.keyArtists);
    console.log(this.artistCollection);
  }

  addAlbum(album: AlbumModel) {
    this.albumCollection.push(album);
    this.localstorageService.setCollection(this.keyAlbums, JSON.stringify(this.albumCollection));
    this.albumCollection = this.getContextCollection(this.keyAlbums);
  }

  addSong(song: SongModel) {
    this.songCollection.push(song);
    this.localstorageService.setCollection(this.keySongs, JSON.stringify(this.songCollection));
    this.songCollection = this.getContextCollection(this.keySongs)
  }

  generateUUID() {
    return uuidv4();
  }

  getAllArtist() {
    // Pendient...
  }

  getAlbumsSongsByArtistUUID(artistUUID: string) {
    let albumsSongs: Array<AlbumSongModel> = [];
    for (let album of this.albumCollection) {
      if (album.artistUUID == artistUUID) {

        let currentSongs: Array<SongModel> = [];
        currentSongs = this.getSongs(album.albumUUID);

        let currentSongsWithStates: Array<SongProgressModel> = [];
        currentSongsWithStates = this.setValuesStates(currentSongs)

        let albumSong: AlbumSongModel;
        albumSong = {
          albumUUID: album.albumUUID,
          title: album.title,
          genre: album.genre,
          year: album.year,
          imageCover: album.imageCover,
          songs: currentSongsWithStates
        }
        albumsSongs.push(albumSong);
      }
    }
    return albumsSongs;
  }

  setValuesStates(songs: Array<SongModel>) {
    let songsWithStates: Array<SongProgressModel> = [];
    for (let song of songs) {
      let songStates: SongProgressModel;
      songStates = {
        songUUID: song.songUUID,
        title: song.title,
        genre: song.genre,
        year: song.year,
        duration: song.duration,
        linkSong: song.linkSong,
        albumUUID: song.albumUUID,
        songProgress: this.songProgressInit,
        songState: "STOP"
      }
      songsWithStates.push(songStates)
    }
    return songsWithStates;
  }

  SetDataDefault() {

    this.localstorageService.setCollection(this.keyArtists, JSON.stringify((dataArtist as any).default));

    this.localstorageService.setCollection(this.keyAlbums, JSON.stringify((dataAlbum as any).default));

    this.localstorageService.setCollection(this.keySongs, JSON.stringify((dataSong as any).default));
  }

}

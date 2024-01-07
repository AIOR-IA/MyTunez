import {Injectable} from '@angular/core';
import {AngularFireStorage} from "@angular/fire/storage";
import {ArtistModel} from "@core/models/artist.model";
import {BusinessLogicService} from "@shared/services/business-logic.service";
import {AlbumModel} from "@core/models/album.model";
import {SongModel} from "@core/models/song.model";

@Injectable({
  providedIn: 'root'
})
export class RegistrationLogicService {
  public pathArtist: string = "images/artist/";
  public pathAlbum: string = "images/album/";
  public pathSong: string = "audios/song/";

  constructor(private readonly angularFireStorage: AngularFireStorage,
              private logic: BusinessLogicService) {
  }

  async registerArtist(artistForm: any) {
    // GENERATE ARTIST UUID
    let generateArtistUUID: string;
    generateArtistUUID = this.logic.generateUUID();

    // GENERATE FILE URL
    await this.uploadFile(generateArtistUUID, artistForm.image.value, this.pathArtist).then((url: any) => {
      // BUILD DATA
      let artistNew: ArtistModel;
      artistNew = {
        artistUUID: generateArtistUUID,
        name: artistForm.name.value,
        genres: artistForm.genres.value,
        members: artistForm.members.value,
        website: artistForm.website.value,
        image: url.toString()
      }


      // ADD ARTIST DATABASE LOCAL STORAGE
      this.logic.addArtist(artistNew);
    });

  }

  async registerAlbum(albumForm: any) {
    // GENERATE ALBUM UUID
    let generateAlbumUUID: string;
    generateAlbumUUID = this.logic.generateUUID();

    // GENERATE FILE URL
    await this.uploadFile(generateAlbumUUID, albumForm.imageCover.value, this.pathAlbum).then((url: any) => {
      // BUILD DATA
      let albumNew: AlbumModel;
      albumNew = {
        albumUUID: generateAlbumUUID,
        title: albumForm.title.value,
        genre: albumForm.genre.value,
        year: albumForm.year.value,
        imageCover: url.toString(),
        artistUUID: albumForm.artist.value,
      }


      // ADD ARTIST DATABASE LOCAL STORAGE
      this.logic.addAlbum(albumNew);
    });
  }

  async registerSong(songForm: any) {
    // GENERATE ALBUM UUID
    let generateSongUUID: string;
    generateSongUUID = this.logic.generateUUID();

    // GET DURATION SONG
    await this.getDurationAudio(songForm.linkSong.value).then(async response => {
      let durationSong: any;
      durationSong = response;

      // GENERATE FILE URL
      await this.uploadFile(generateSongUUID, songForm.linkSong.value, this.pathSong).then((url: any) => {

        // BUILD DATA
        let songNew: SongModel;
        songNew = {
          songUUID: generateSongUUID,
          title: songForm.title.value,
          genre: songForm.genre.value,
          year: songForm.year.value,
          duration: durationSong,
          linkSong: url.toString(),
          albumUUID: songForm.album.value,
        }


        // ADD ARTIST DATABASE LOCAL STORAGE
        this.logic.addSong(songNew);
      });
    });
  }

  // UPLOAD FILE TO FIREBASE
  async uploadFile(UUID: string, file: any, pathType: string) {
    const path = pathType + UUID;
    const fileRef = await this.angularFireStorage.ref(path);
    // UPLOAD FILE
    await this.angularFireStorage.upload(path, file)
    // GET FILE URL
    return new Promise((response) => {
      this.angularFireStorage.upload(path, file).then(() => {
        fileRef.getDownloadURL().subscribe(url => {

          response(url)
        })
      }).catch(error => {
        console.log(error);
      })
    })
  }

  async getDurationAudio(file: any) {

    const audio = new Audio();

    return new Promise((response) => {
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.round(duration % 60);
        response(minutes + ":" + seconds)
      });
      audio.src = URL.createObjectURL(file);
    })

  }
}

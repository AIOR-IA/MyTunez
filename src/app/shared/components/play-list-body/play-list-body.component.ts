import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlbumModel} from '@core/models/album.model';
import {TrackModel} from '@core/models/tracks.model';
import * as dataRaw from '../../../data/tracks.json';
import {MultimediaService} from '../../services/multimedia.service';
import {SongModel} from '@core/models/song.model';
import {MediaPlayerModel} from '@core/models/media-player.model';
import {TrackService} from '@modules/tracks/services/track.service';
import {BusinessLogicService} from '../../services/business-logic.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-play-list-body',
  templateUrl: './play-list-body.component.html',
  styleUrls: ['./play-list-body.component.scss']
})
export class PlayListBodyComponent implements OnInit, OnDestroy {

  @Input() nameArtist: string;
  @Input() dataSongs: SongModel[];
  @Input() dataAlbum: AlbumModel;

  listObservers$: Subscription[];
  listTracks: TrackModel[] = [];
  listMediaPlayer: MediaPlayerModel[] = [];
  optionSort: { property: string | null, order: string } = {property: null, order: 'asc'}

  indexSong: number = -1;
  indexAlbum: number;
  SizeAlbum: number;
  sizeSongs: number;

  //PARAM SUFFLE
  arraySuffle: Array<number> = [];
  countSuffle: number = 0;

  stateSuffle:string ="off"
  constructor(private multimediaService: MultimediaService,
              private trackService: TrackService,
              private logicService: BusinessLogicService) {
  }

  ngOnDestroy(): void {
    this.listObservers$.forEach(res => res.unsubscribe());
  }

  ngOnInit(): void {
    const {data}: any = (dataRaw as any).default
    this.listTracks = data;
    console.log("PLAYLISTBODY-NAME ARTIST", this.nameArtist);
    console.log("PLAYLISTBODY-NAME DATA SONGS", this.dataSongs);
    console.log("PLAYLISTBODY-NAME DATAALBUM", this.dataAlbum);

    this.loadDataSongs();

    console.log("mediaPlayerSending", this.listMediaPlayer);

    // PREVIOUS AND NEXT SONG
    this.multimediaService.songPrevious$.subscribe(res => {
      console.log("res ------", res);
      this.PreviosLogic();
    })

    this.multimediaService.songNext$.subscribe(res => {
      console.log("SUBSCRIBE OF SONG NEXT", res);
      this.nextLogic();
    })

    // PREVIOUS AND NEXT SONG SUFFLE
    this.multimediaService.songPreviousSuffle$.subscribe(res => {
      console.log("songPreviousSuffle$  " + res);
      this.previosSuffleLogic();
    })

    this.multimediaService.songNextSuffle$.subscribe(res => {
      console.log("songNextSuffle$  " + res);
      this.nextSuffleLogic();
    })

    // ON OR OFF SUFFLE
    this.multimediaService.stateSuffle$.subscribe(response => {
      console.log("stateSuffle$ =  " + response);
      if (response === "on") {
          this.generatePositionRandom()
      } else {
        console.log("ESTA APAGO EL SUFFLE")
      }

    })


    const observer1$ = this.trackService.dataFormSong$.subscribe((res: any) => {
      let newSongs: SongModel[] = res.filter((ress: any) => ress.albumUUID === this.dataAlbum.albumUUID);

      this.dataSongs = newSongs;
      this.loadDataSongs();

    })
    const observer2$ = this.trackService.statusSong$.subscribe((res: any) => {
      if (this.listMediaPlayer[this.indexSong].state) {
        this.listMediaPlayer[this.indexSong].state = false;
      } else {
        this.listMediaPlayer[this.indexSong].state = true;
      }
    })
    this.listObservers$ = [observer1$, observer2$];
  }

  changeSort(property: string): void {
    const {order} = this.optionSort
    this.optionSort = {
      property,
      order: order === 'asc' ? 'desc' : 'asc'
    }
  }

  GetTrack(track: MediaPlayerModel, songIndex: any) {

    if (songIndex === this.indexSong) {
      if (this.listMediaPlayer[songIndex].state) {
        this.listMediaPlayer[songIndex].state = false;
      } else {
        this.listMediaPlayer[songIndex].state = true;
      }
      this.multimediaService.togglePlayerStatus();
    } else {
      this.indexSong = songIndex;
      this.resetStateSong()
      this.listMediaPlayer[songIndex].state = true;
      this.multimediaService.trackInfo$.next(track);
    }
  }

  loadDataSongs() {
    this.listMediaPlayer = [];
    this.dataSongs.forEach(res => {
      let dataInfo: MediaPlayerModel = {
        nameSong: res.title,
        albumTitle: this.dataAlbum.title,
        albumCover: this.dataAlbum.imageCover,
        urlSong: res.linkSong,
        durationSong: res.duration,
        yearSong: res.year,
        nameArtist: this.nameArtist,
        songUUID: res.songUUID,
        state: false
      }
      this.listMediaPlayer.push(dataInfo);

    })
  }

  resetStateSong() {
    this.listMediaPlayer.forEach(res => {
      res.state = false;
    })
  }

  PreviosLogic() {

    let idArtistPrevious = this.dataAlbum.artistUUID;
    let AlbumCollection = this.logicService.getAlbumsSongsByArtistUUID(idArtistPrevious);
    let songCollection = this.logicService.getSongs(this.dataAlbum.albumUUID);

    this.SizeAlbum = AlbumCollection.length;
    this.indexAlbum = AlbumCollection.findIndex(res => res.albumUUID === this.dataAlbum.albumUUID);
    this.sizeSongs = songCollection.length;
    console.log("album collection", AlbumCollection);
    console.log("album size", this.SizeAlbum);
    console.log("album position", this.indexAlbum);
    console.log("song position", this.indexSong);
    console.log("songs size", this.sizeSongs);

    // VALIDATION PREVIOUS
    if (this.indexSong == 0) {
      this.indexSong = (this.sizeSongs - 1);
      this.changeSong()
    } else {
      this.indexSong = this.indexSong - 1;
      this.changeSong()
    }
  }

  nextLogic() {
    console.warn("NEXT LOGIC")
    let idArtistPrevious = this.dataAlbum.artistUUID;
    let AlbumCollection = this.logicService.getAlbumsSongsByArtistUUID(idArtistPrevious);
    let songCollection = this.logicService.getSongs(this.dataAlbum.albumUUID);

    this.SizeAlbum = AlbumCollection.length;
    this.indexAlbum = AlbumCollection.findIndex(res => res.albumUUID === this.dataAlbum.albumUUID);
    this.sizeSongs = songCollection.length;
    console.log("album collection", AlbumCollection);
    console.log("album size", this.SizeAlbum);
    console.log("album position", this.indexAlbum);
    console.log("song position", this.indexSong);
    console.log("songs size", this.sizeSongs);


    if (this.indexSong == (this.sizeSongs - 1)) {
      this.indexSong = 0;
      this.changeSong()
    } else {
      this.indexSong = this.indexSong + 1;
      this.changeSong()
    }
  }

  changeSong() {
    this.resetStateSong()
    this.listMediaPlayer[this.indexSong].state = true;
    console.warn("INDEX SONG")
    console.log(this.indexSong)
    console.warn("ENVIANDO");
    console.log(this.listMediaPlayer[this.indexSong])
    console.warn("---------------");
    this.multimediaService.trackInfo$.next(this.listMediaPlayer[this.indexSong]);

  }

  previosSuffleLogic() {
    console.log("ATRAS SUFFLE")
    console.warn("AUXILIO 1")
    console.log(this.indexSong)
    console.log(this.countSuffle)
    console.warn("---------------")

    if (this.countSuffle== 0) {
      this.countSuffle = this.arraySuffle.length - 1
      this.indexSong = this.arraySuffle[this.countSuffle];
      this.changeSong()
    } else {
      this.countSuffle--;
      this.indexSong = this.arraySuffle[this.countSuffle];
      this.changeSong()
    }

    console.log("ATRAS SUFFLE")
    console.warn("AUXILIO 1")
    console.log(this.indexSong)
    console.log(this.countSuffle)
    console.warn("---------------")


  }


  nextSuffleLogic() {
    console.log("SIGUIENTE SUFFLE")

    if (this.countSuffle== (this.arraySuffle.length - 1)) {
      this.countSuffle = 0
      this.indexSong = this.arraySuffle[this.countSuffle];

      this.changeSong()
    } else {
      this.countSuffle++;
      this.indexSong = this.arraySuffle[this.countSuffle];
      this.changeSong()
    }
  }

  generatePositionRandom() {
    let i = 0;
    this.listMediaPlayer.forEach(value => {
      this.arraySuffle[i] = i;
      i++;
    })

    this.arraySuffle = this.shuffleArray(this.arraySuffle, this.indexSong);
    console.warn("ARRAY SUFFLE")
    console.log(this.arraySuffle)
  }

  shuffleArray(arr: number[], index: number): number[] {
    // Seleccionar el valor en el índice especificado
    const selectedValue = arr[index];
    // Eliminar el valor seleccionado del arreglo
    arr.splice(index, 1);
    // Barajar los valores restantes de manera aleatoria
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Agregar el valor seleccionado al inicio del arreglo
    arr.unshift(selectedValue);
    // Devolver el arreglo resultante
    return arr;
  }
}


// // Ejemplo de uso
// const arr = [0, 1, 2, 3, 4, 5, 6];
// const shuffledArr = shuffleArray(arr, 2);
// console.log(shuffledArr); // Ejemplo de salida: [2, 3, 1, 0, 5, 4, 6]

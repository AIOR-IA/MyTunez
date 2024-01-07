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
import { StateCurrenSong } from '@core/interfaces/stateCurrentSong.interface';

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

  currentSong: StateCurrenSong;
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
    this.loadDataSongs();

    console.log(this.dataAlbum)
    console.log(this.indexSong)
    this.currentSong = this.multimediaService.getStateCurrentSong();
    console.log(this.currentSong );
    if(this.currentSong  && this.currentSong.state) {
      if(this.currentSong.album.albumUUID === this.dataAlbum.albumUUID ) {
        this.listMediaPlayer[this.currentSong .idx].state = true;
        this.indexSong = this.currentSong .idx;
      }
    }

    this.multimediaService.getStateCurrentSong();

    // PREVIOUS AND NEXT SONG
    this.multimediaService.songPrevious$.subscribe(res => {
      this.PreviosLogic();
    })

    this.multimediaService.songNext$.subscribe(res => {
      console.log("songNext$")
      this.nextLogic();
    })

    // PREVIOUS AND NEXT SONG SUFFLE
    this.multimediaService.songPreviousSuffle$.subscribe(res => {
      this.previosSuffleLogic();
    })

    this.multimediaService.songNextSuffle$.subscribe(res => {
      this.nextSuffleLogic();
    })

    // ON OR OFF SUFFLE
    this.multimediaService.stateSuffle$.subscribe(response => {
      if (response === "on") {
          this.generatePositionRandom()
      } else {

      }

    })

    const observer1$ = this.trackService.dataFormSong$.subscribe((res: any) => {
      let newSongs: SongModel[] = res.filter((ress: any) => ress.albumUUID === this.dataAlbum.albumUUID);

      this.dataSongs = newSongs;
      this.loadDataSongs();

    })
    const observer2$ = this.trackService.statusSong$.subscribe((res: any) => {
      if (this.listMediaPlayer[this.indexSong].state) {
        this.listMediaPlayer[this.indexSong].state   = false;
        this.multimediaService.StateCurrentSong.state = false;

      } else {
        this.listMediaPlayer[this.indexSong].state = true;
        this.multimediaService.StateCurrentSong.state = true;
      }
    })
    this.listObservers$ = [observer1$, observer2$];

    // console.log(this.listMediaPlayer);
  }

  changeSort(property: string): void {
    const {order} = this.optionSort
    this.optionSort = {
      property,
      order: order === 'asc' ? 'desc' : 'asc'
    }
  }

  GetTrack(track: MediaPlayerModel, songIndex: any) {
    console.log({track, songIndex})
    // console.log(this.indexSong);
    if (songIndex === this.indexSong) {
      console.log("start");
      if (this.listMediaPlayer[songIndex].state) {
        this.listMediaPlayer[songIndex].state = false;
        this.multimediaService.deleteStateCurrentSong();

      } else {
        this.multimediaService.setStateCurrentSong(this.dataAlbum,songIndex);
        this.listMediaPlayer[songIndex].state = true;
      }
      console.log(track.state)
      this.multimediaService.togglePlayerStatus();
    } else {
      console.log("pause");

      this.indexSong = songIndex;
      this.resetStateSong()
      this.listMediaPlayer[songIndex].state = true;
      this.multimediaService.trackInfo$.next(track);
      this.multimediaService.setStateCurrentSong(this.dataAlbum,songIndex);
    }
    console.log(track)
    console.log(this.listMediaPlayer)
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
    let idArtistPrevious = this.dataAlbum.artistUUID;
    let AlbumCollection = this.logicService.getAlbumsSongsByArtistUUID(idArtistPrevious);
    let songCollection = this.logicService.getSongs(this.dataAlbum.albumUUID);

    this.SizeAlbum = AlbumCollection.length;
    this.indexAlbum = AlbumCollection.findIndex(res => res.albumUUID === this.dataAlbum.albumUUID);
    this.sizeSongs = songCollection.length;



    if (this.indexSong == (this.sizeSongs - 1)) {
      this.indexSong = 0;
      this.changeSong()
    } else {
      this.indexSong = this.indexSong + 1;
      this.changeSong()
    }
  }

  changeSong() {
    console.log(this.listMediaPlayer);
    console.log(this.listMediaPlayer[this.indexSong]);
    this.resetStateSong()
    this.listMediaPlayer[this.indexSong].state = true;

    this.multimediaService.trackInfo$.next(this.listMediaPlayer[this.indexSong]);
  }

  previosSuffleLogic() {

    if (this.countSuffle== 0) {
      this.countSuffle = this.arraySuffle.length - 1
      this.indexSong = this.arraySuffle[this.countSuffle];
      this.changeSong()
    } else {
      this.countSuffle--;
      this.indexSong = this.arraySuffle[this.countSuffle];
      this.changeSong()
    }
  }


  nextSuffleLogic() {
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
    console.log(this.arraySuffle);
  }

  shuffleArray(arr: number[], index: number): number[] {
    const selectedValue = arr[index];
    arr.splice(index, 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    arr.unshift(selectedValue);
    return arr;
  }
}


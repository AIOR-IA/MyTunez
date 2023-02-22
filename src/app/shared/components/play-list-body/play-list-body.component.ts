import {Component, Input, OnInit} from '@angular/core';
import {AlbumModel} from '@core/models/album.model';
import {TrackModel} from '@core/models/tracks.model';
import * as dataRaw from '../../../data/tracks.json';
import {MultimediaService} from '../../services/multimedia.service';
import {SongModel} from '@core/models/song.model';
import {MediaPlayerModel} from '@core/models/media-player.model';
import {TrackService} from '@modules/tracks/services/track.service';

@Component({
  selector: 'app-play-list-body',
  templateUrl: './play-list-body.component.html',
  styleUrls: ['./play-list-body.component.scss']
})
export class PlayListBodyComponent implements OnInit {

  @Input() nameArtist: string;
  @Input() dataSongs: SongModel[];
  @Input() dataAlbum: AlbumModel;

  listTracks: TrackModel[] = [];
  listMediaPlayer: MediaPlayerModel[] = [];
  optionSort: { property: string | null, order: string } = {property: null, order: 'asc'}

  indexSong: number;
  indexAlbum: number;

  constructor(private multimediaService: MultimediaService,
              private trackService: TrackService) {
  }

  ngOnInit(): void {
    const {data}: any = (dataRaw as any).default
    this.listTracks = data;
    console.log("PLAYLISTBODY-NAME ARTIST", this.nameArtist);
    console.log("PLAYLISTBODY-NAME DATA SONGS", this.dataSongs);
    console.log("PLAYLISTBODY-NAME DATAALBUM", this.dataAlbum);

    this.loadDataSongs();

    console.log("mediaPlayerSending", this.listMediaPlayer);

    this.multimediaService.trackPrevious$.subscribe(res => {
      // let dataInfo : MediaPlayerModel = {
      //   nameSong :"test",
      //   albumTitle: "album test",
      //   albumCover: "https://i.scdn.co/image/ab67616d0000b27310c74bb7c32ff79db8dcb4d5",
      //   urlSong: "https://firebasestorage.googleapis.com/v0/b/mytunez-46394.appspot.com/o/Songs%2FLuisFonsi%2FVida%2FLuis%20Fonsi%20No%20Me%20Doy%20Por%20Vencido.mp3?alt=media&token=e789e45c-1f29-459f-896c-3347674de200",
      //   durationSong: "05:00",
      //   yearSong : "2015",
      //   nameArtist: "beto cuevas",
      //   songUUID : "125"
      // }
      // console.log("CAPTURANDO EVENTO CLICK DESDE PLAY LIST BODY" , res);
      // this.GetTrack(dataInfo);
    })

    const observer1$ = this.trackService.dataFormSong$.subscribe((res: any) => {
      let newSongs: SongModel[] = res.filter((ress: any) => ress.albumUUID === this.dataAlbum.albumUUID);

      this.dataSongs = newSongs;
      this.loadDataSongs();

    })
  }

  changeSort(property: string): void {
    const {order} = this.optionSort
    this.optionSort = {
      property,
      order: order === 'asc' ? 'desc' : 'asc'
    }
  }

  GetTrack(track: MediaPlayerModel, songIndex: any) {
    console.warn("GET TRACK INDEX")
    console.log(songIndex)
    this.indexSong = songIndex;
    console.warn("GET TRACK TRACK")
    console.log(track);

    console.warn("CHANGE STATE OF TRACK STOP TO PLAY")
    this.resetStateSong()
    this.listMediaPlayer[songIndex].state = true;
    console.log(this.listMediaPlayer);

    this.multimediaService.trackInfo$.next(track);
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
}

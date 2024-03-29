import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {MediaPlayerModel} from '../../core/models/media-player.model';
import {ArtistModel} from "@core/models/artist.model";
import { AlbumModel } from '@core/models/album.model';
import { StateCurrenSong } from '@core/interfaces/stateCurrentSong.interface';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {

  callback: EventEmitter<any> = new EventEmitter<any>();

  //Get Element Audio HTML
  public audio: HTMLAudioElement;

  //Get Data infoSong
  public trackInfo$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  public songPrevious$ = new Subject<any>();
  public songPreviousSuffle$ = new Subject<any>();

  public songNext$ = new Subject<any>();
  public songNextSuffle$ = new Subject<any>();
  public stateSuffle$ = new Subject<any>();
  //Get Data timeElapsedProgress song
  public timeElapsed$: BehaviorSubject<string> = new BehaviorSubject("00:00");

  //Get Data timeRemaining song
  public timeRemaining$: BehaviorSubject<string> = new BehaviorSubject("-00:00");

  //Get Data StatusSong song
  public playerStatusSong$: BehaviorSubject<string> = new BehaviorSubject("paused");

  //Get timeNow song for progressbar
  public playerPercentage$: BehaviorSubject<number> = new BehaviorSubject(0);

  private statusShuffle: boolean = false;

  public StateCurrentSong: StateCurrenSong;

  constructor() {
    this.audio = new Audio();
    this.trackInfo$.subscribe(responseInfoAudio => {
      if (responseInfoAudio ) {
        this.setAudio(responseInfoAudio)

      }
    })

    this.deleteStateCurrentSong();
    this.listenAllEvents();
  }

  //PLAY SONG
  public setAudio(track: MediaPlayerModel): void {
    this.audio.src = track.urlSong;
    this.audio.pause();

    setTimeout(() => {
       this.audio.play();
    }, 150);
  }

  private listenAllEvents(): void {
    this.audio.addEventListener('timeupdate', this.calculateTime, false);
    this.audio.addEventListener('playing', this.setPlayerStatus, false);
    this.audio.addEventListener('play', this.setPlayerStatus, false);
    this.audio.addEventListener('pause', this.setPlayerStatus, false);
    this.audio.addEventListener('ended', this.setPlayerStatus, false);
  }

  private calculateTime = () => {
    const {duration, currentTime} = this.audio;
    this.setTimeElapsed(currentTime);
    this.setTimeRemaining(currentTime, duration);
    this.setPercentage(currentTime, duration);
  }

  // states play playing pause ended
  private setPlayerStatus = (state: any) => {
    switch (state.type) {
      case 'play':
        this.playerStatusSong$.next('play')
        break
      case 'playing':
        this.playerStatusSong$.next('playing')
        break
      case 'ended':
        this.playerStatusSong$.next('ended');
        (this.statusShuffle) ? this.songNextSuffle() : this.songNext();
        break
      default:

        this.playerStatusSong$.next('paused')
        break
    }
  }

  private setTimeElapsed(currentTime: number): void {
    let seconds = Math.floor(currentTime % 60);
    let minutes = Math.floor((currentTime / 60) % 60);

    const displaySeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;

    const displayFormat = `${displayMinutes}:${displaySeconds}`;

    this.timeElapsed$.next(displayFormat);
  }

  private setTimeRemaining(currentTime: number, duration: number) {
    let timeLeft = duration - currentTime;
    let seconds = Math.floor(timeLeft % 60);
    let minutes = Math.floor((timeLeft / 60) % 60);

    const displaySeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;

    const displayFormat = `-${displayMinutes}:${displaySeconds}`;
    (displayFormat === '-NaN:NaN') ? this.timeRemaining$.next('-00:00') : this.timeRemaining$.next(displayFormat);
  }

  public togglePlayerStatus(): void {
    if(this.audio.src !== '' ) {
       (this.audio.paused) ? this.audio.play() : this.audio.pause();
    }
  }

  private setPercentage(currentTime: number, duration: number) {
    let percentage = (currentTime * 100) / duration;
    this.playerPercentage$.next(percentage);
  }

  public SeekAndPlay(percentage: number): void {
    const {duration} = this.audio;
    const percentageToSecond = (percentage * duration) / 100;
    this.audio.currentTime = percentageToSecond;
  }

  public mutedAudio() {
    const {muted} = this.audio;
    (muted) ? this.audio.muted = false : this.audio.muted = true;
  }

  // BUTTON ACTION
  public previousSong() {
    const {currentTime} = this.audio;
    if (currentTime <= 10) {
      this.songPrevious();
      this.StateCurrentSong.idx--;
    } else {
      this.audio.currentTime = 0;
    }
  }

  // CONFIGURATION FOR VOLUME
  changeVolume(number: number = 50) {
    this.audio.volume = number;
  }

//  SONG PREVIOUS
  songPrevious() {
    this.songPrevious$.next("change previous song");
  }

  //  SONG NEXT
  songNext() {
    this.audio.pause();
    this.songNext$.next("change next song");
    this.StateCurrentSong.idx++;
  }

  previousSongSuffle() {
    const {currentTime} = this.audio;
    if (currentTime <= 10) {
      this.songPreviousSuffle$.next("change previous suffle song");
    } else {
      this.audio.currentTime = 0;
    }
  }

  //  SONG NEXT
  songNextSuffle() {
    this.songNextSuffle$.next("change next suffle song");
  }

  // ON AND OFF SUFFLE
  changeStateShuffle(state: string) {
    (state === 'on') ? this.statusShuffle = true : this.statusShuffle = false;
    this.stateSuffle$.next(state);
  }

  setStateCurrentSong(album: AlbumModel, idx:number) {
    this.StateCurrentSong = {
      album,
      idx,
      state: true
    }
    localStorage.setItem("currentSong",JSON.stringify(this.StateCurrentSong))
  }

  deleteStateCurrentSong() {
    // this.StateCurrenSong.state = false;
  }

  getStateCurrentSong() {
    // if(!localStorage.getItem("currentSong")) return;
    // const storedData = localStorage.getItem("currentSong");
    // const data = storedData ? JSON.parse(storedData) : {};
    return this.StateCurrentSong;
  }
}

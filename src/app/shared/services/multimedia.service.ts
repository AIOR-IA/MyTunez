import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {MediaPlayerModel} from '../../core/models/media-player.model';
import {ArtistModel} from "@core/models/artist.model";

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {

  callback: EventEmitter<any> = new EventEmitter<any>();

  //Get Element Audio HTML
  public audio: HTMLAudioElement;

  //Get Data infoSong
  public trackInfo$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  //Get Data infoSong
  // subject
  public trackPrevious$: BehaviorSubject<string> = new BehaviorSubject("hola");

  public songPrevious$ = new Subject<any>();

  //Get Data timeprogress song
  public timeElapsed$: BehaviorSubject<string> = new BehaviorSubject("00:00");

  //Get Data timeRemaining song
  public timeRemaining$: BehaviorSubject<string> = new BehaviorSubject("-00:00");

  //Get Data timeRemaining song
  public playerStatusSong$: BehaviorSubject<string> = new BehaviorSubject("paused");

  //Get timeNow song for progressbar
  public playerPercentage$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor() {
    this.audio = new Audio();
    this.trackInfo$.subscribe(responseInfoAudio => {
      if (responseInfoAudio) {
        // console.log("multimediaService ---> : ", responseInfoAudio);
        this.setAudio(responseInfoAudio)
      }
    })

    this.listenAllEvents();
  }

  //PLAY SONG
  public setAudio(track: MediaPlayerModel): void {
    // console.log("SetAUDIO --->",track);
    this.audio.src = track.urlSong;
    this.audio.play();
  }

  private listenAllEvents(): void {

    this.audio.addEventListener('timeupdate', this.calculateTime, false);
    this.audio.addEventListener('playing', this.setPlayerStatus, false);
    this.audio.addEventListener('play', this.setPlayerStatus, false);
    this.audio.addEventListener('pause', this.setPlayerStatus, false);
    this.audio.addEventListener('ended', this.setPlayerStatus, false);
  }

  private calculateTime = () => {
    //  console.log('Disparando Evento');
    const {duration, currentTime} = this.audio;
    //  console.table([duration,currentTime]);
    this.setTimeElapsed(currentTime);
    this.setTimeRemaining(currentTime, duration);
    this.setPercentage(currentTime, duration);
  }

  // states play playing pause ended
  private setPlayerStatus = (state: any) => {
    console.log("status player ready --> ", state);
    switch (state.type) {
      case 'play':
        this.playerStatusSong$.next('play')
        break
      case 'playing':
        this.playerStatusSong$.next('playing')
        break
      case 'ended':
        this.playerStatusSong$.next('ended')
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

    this.timeRemaining$.next(displayFormat);
  }

  public togglePlayerStatus(): void {
    (this.audio.paused) ? this.audio.play() : this.audio.pause();
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
      this.audio.currentTime = 0;
    }
    else {
      this.songPrevious();
    }
    console.log(currentTime)
  }

  // CONFIGURATION FOR VOLUME
  changeVolume(number: number) {
    this.audio.volume = number;
  }

//  SONG PREVIOUS
  songPrevious(){
    // let AllArtist: ArtistModel[] = this.logicService.artistCollection;
    // this.dataFormArtist$.next(AllArtist);
  }
}

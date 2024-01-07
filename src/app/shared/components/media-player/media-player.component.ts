import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {TrackModel} from '../../../core/models/tracks.model';
import {MultimediaService} from '../../services/multimedia.service';
import {TrackService} from '../../../modules/tracks/services/track.service';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('progressBar') progressBarHTML: ElementRef;
  listObservers$: Subscription[];
  statePlayer: string = 'paused';

  // volume default
  volume = 50;
  stateVoume = "sound";

  //Shuffle
  stateShuffle = "off";

  constructor(public multimediaService: MultimediaService, private trackService: TrackService) {
    this.multimediaService.changeVolume(this.volume / 100);
  }


  ngOnInit(): void {

    const observerStatus$ = this.multimediaService.playerStatusSong$.subscribe(status => {
      this.statePlayer = status;
      console.log(status)
    })
    this.listObservers$ = [observerStatus$];

  }

  ngOnDestroy(): void {
    this.listObservers$.forEach(res => res.unsubscribe());
  }

  public changeStatePlayer(): void {
    this.multimediaService.togglePlayerStatus();
    this.trackService.statusSong$.next("change State List Song");
  }

  mousePosition(event: MouseEvent) {
    const ElementNative: HTMLElement = this.progressBarHTML.nativeElement;
    const {clientX} = event;
    const {x, width} = ElementNative.getBoundingClientRect();
    const positionX = clientX - x;
    const percentageFromX = (positionX * 100) / width;
    this.multimediaService.SeekAndPlay(percentageFromX);
  }

  SongPrevious() {
    if (this.stateShuffle == 'on') {
      this.multimediaService.previousSongSuffle();
    } else {
      this.multimediaService.previousSong();
    }
  }

  SongNext() {
    if (this.stateShuffle == 'on') {
      this.multimediaService.songNextSuffle();
    } else {
      this.multimediaService.songNext();
    }
  }


// CONFIGURATION FOR VOLUME
  changeSliderVolume(event: any) {
    this.volume = event.value;
    if ( this.volume == 0) {
      this.stateVoume = 'mute'
    } else {
      this.stateVoume = 'sound'
    }
    this.setVolumeSytem( this.volume)
  }

  changeStateVolume(stateVoume: string) {
    if (stateVoume == 'mute') {
      this.setVolumeSytem(0)

    }
    if (stateVoume == 'sound') {
      this.setVolumeSytem(this.volume)
    }
    this.stateVoume = stateVoume
  }

  setVolumeSytem(volume: number) {
    const volumeSystem = volume / 100;
    this.multimediaService.changeVolume(volumeSystem);
  }

  changeStateShuffle(state: string) {
    this.stateShuffle = state
    this.multimediaService.changeStateShuffle(state);
  }
}

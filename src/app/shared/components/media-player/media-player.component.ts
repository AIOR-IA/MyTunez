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

  // mockCover: TrackModel = {
  //   cover:'https://i.scdn.co/image/ab67616d0000b273b1504069929fe0a81594eb33',
  //   name:'Luis Miguel',
  //   album:'ARIES',
  //   url:'http://localhost/track.mp3',
  //   _id:1
  // }
  // mockCover:TrackModel;
  @ViewChild('progressBar') progressBarHTML: ElementRef;
  listObservers$: Subscription[];
  statePlayer: string = 'paused';

  // volume default
  volume = 5;
  stateVoume = "sound";

  //Shuffle
  stateShuffle = "off";

  constructor(public multimediaService: MultimediaService, private trackService: TrackService) {
    this.multimediaService.changeVolume(this.volume / 100);
  }


  ngOnInit(): void {
    
    const observerStatus$ = this.multimediaService.playerStatusSong$.subscribe(status => {
      this.statePlayer = status;
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

    let volumeSlider = event.value;
    if (volumeSlider == 0) {
      this.stateVoume = 'mute'
    } else {
      this.stateVoume = 'sound'
    }
    this.setVolumeSytem(volumeSlider)
  }

  changeStateVolume(stateVoume: string) {
    if (stateVoume == 'mute') {
      this.volume = 0;
    }
    if (stateVoume == 'sound') {
      this.volume = 65;
    }
    this.stateVoume = stateVoume
    this.setVolumeSytem(this.volume)
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

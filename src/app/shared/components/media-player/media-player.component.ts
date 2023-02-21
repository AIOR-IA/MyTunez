import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackModel } from '../../../core/models/tracks.model';
import { MultimediaService } from '../../services/multimedia.service';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit,OnDestroy {

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
  constructor(public  multimediaService : MultimediaService ) { }
 

  ngOnInit(): void {
    // const observeSong$:Subscription = this.multimediaService.callback.subscribe((
    //   response =>{
    //     console.log('listening song from mediaplayer component', response);
    //   }
    // ))
    // this.multimediaService.trackInfo$.subscribe(res =>{
    //    this.mockCover=res;
    //   console.log("se tiene que reproducir la cancion que se reciba aqui", res);
    // })
    const observerStatus$ = this.multimediaService.playerStatusSong$.subscribe(status =>{
      console.log("statussss ", status);
      this.statePlayer=status;
    })
    this.listObservers$ = [observerStatus$];

  }
  ngOnDestroy(): void {
    this.listObservers$.forEach(res => res.unsubscribe());
  }
  public changeStatePlayer():void {
    this.multimediaService.togglePlayerStatus();
  }

  mousePosition(event:MouseEvent){
    const ElementNative: HTMLElement = this.progressBarHTML.nativeElement;
    const {clientX} = event;
    const {x,width} = ElementNative.getBoundingClientRect();
    const positionX = clientX - x;
    const percentageFromX = (positionX * 100) / width;
    // console.log(`Position(x): ${percentageFromX}`);
    this.multimediaService.SeekAndPlay(percentageFromX);
  }
  SongPrevious(){
    console.log("previous")
    //this is for muted audio
    // this.multimediaService.mutedAudio();

    this.multimediaService.previousSong();
    
  }
  SongNext(){
    console.log("SONG NEXT MEDIA PLAYER");
    this.multimediaService.trackPrevious$.next("hola desde media player");
  }
}

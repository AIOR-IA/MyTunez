import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackModel } from '../../../core/models/tracks.model';
import { MultimediaService } from '../../services/multimedia.service';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit {

  mockCover: TrackModel = {
    cover:'https://i.scdn.co/image/ab67616d0000b273b1504069929fe0a81594eb33',
    name:'Luis Miguel',
    album:'ARIES',
    url:'http://localhost/track.mp3',
    _id:1
  }
  constructor(private multimediaService : MultimediaService ) { }

  ngOnInit(): void {
    const observeSong$:Subscription = this.multimediaService.callback.subscribe((
      response =>{
        console.log('listening song from mediaplayer component', response);
      }
    ))
  }

}

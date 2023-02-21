import { Component, Input, OnInit } from '@angular/core';
import { MultimediaService } from '@shared/services/multimedia.service';
import { TrackModel } from '../../../core/models/tracks.model';
import { AlbumModel } from '../../../core/models/album.model';
import { ArtistModel } from '../../../core/models/artist.model';

@Component({
  selector: 'app-card-player',
  templateUrl: './card-player.component.html',
  styleUrls: ['./card-player.component.scss']
})
export class CardPlayerComponent implements OnInit {

  @Input() mode: 'small' |'big' = 'small';
  @Input() track:AlbumModel;
  @Input() dataArtist: ArtistModel;
  constructor(private multimediaService: MultimediaService) { }

  ngOnInit(): void {
  }

  // sendPlay(track:TrackModel){
  //   console.log("sending track to media Player", track);
  //   this.multimediaService.callback.emit(track);
  // }
  sendPlay(track:AlbumModel):void {
    console.log("sending track to media Player", track);
    // this.multimediaService.trackInfo$.next(track);
  }

}

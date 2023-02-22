import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { TrackModel } from '@core/models/tracks.model';

import * as dataRaw from '../../../data/tracks.json';
import { AlbumModel } from '../../../core/models/album.model';
import { BusinessLogicService } from '../../../shared/services/business-logic.service';
import { ArtistModel } from '../../../core/models/artist.model';
import { SongModel } from '../../../core/models/song.model';
@Injectable({
  providedIn: 'root'
})
export class TrackService {

  dataFormArtist$ = new Subject<any>();

  dataFormAlbum$ = new Subject<any>();

  dataFormSong$ = new Subject<any>();

  statusSong$ = new Subject<any>();
  constructor(private logicService : BusinessLogicService) {
   }

   updateDataArtist(){
    let AllArtist: ArtistModel[] = this.logicService.artistCollection;
    this.dataFormArtist$.next(AllArtist);
   }

   updateDataAlbum(){
    let AllAllbum: AlbumModel[] = this.logicService.albumCollection;
    this.dataFormAlbum$.next(AllAllbum);
   }

   updateDataSong(){
    let AllSong: SongModel[] = this.logicService.songCollection;
    this.dataFormSong$.next(AllSong);
   }

}

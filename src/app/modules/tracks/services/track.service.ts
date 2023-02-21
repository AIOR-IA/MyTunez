import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TrackModel } from '@core/models/tracks.model';

import * as dataRaw from '../../../data/tracks.json';
import { AlbumModel } from '../../../core/models/album.model';
import { BusinessLogicService } from '../../../shared/services/business-logic.service';
@Injectable({
  providedIn: 'root'
})
export class TrackService {

  dataTracksTrending$: Observable<AlbumModel[]> = of([]);

  dataTracksRandom$: Observable<any> = of([]);

  constructor(private logicService : BusinessLogicService) {
    //este envia directamente todos los albums 
    this.dataTracksTrending$ = of (logicService.albumCollection);

    this.dataTracksRandom$ = new Observable((res)=>{
      
      const newAlbum:AlbumModel = {
        albumUUID: "c835a90c-d960-4421-9f71-e6bab5b8cc44",
        title: "Palabras del silencio",
        genre: {
            genreUUID: "0662d30b-f8b6-4fcf-bf17-a6f60813f932",
            name: "ROCK"
        },
        year: "2008",
        imageCover: "https://cdns-images.dzcdn.net/images/cover/6ccdabf92697c28705d08128a84c681f/500x500.jpg",
        artistUUID: "0315ae34-658a-458d-a740-c99354e863bd"
    }
      setTimeout(() => {
        res.next(newAlbum);
      }, 4000);
    })
   }
}

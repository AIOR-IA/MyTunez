import { Component, OnInit } from '@angular/core';
import * as dataRaw from '../../../../data/tracks.json';
import { TrackModel } from '../../../../core/models/tracks.model';
import { ActivatedRoute } from '@angular/router';
///Import para alertas de mensaje
import Swal from 'sweetalert2';
import { AlbumModel } from '../../../../core/models/album.model';
import { BusinessLogicService } from '@shared/services/business-logic.service';
import { TrackService } from '@modules/tracks/services/track.service';
import { Subscription } from 'rxjs';
import { ArtistModel } from '../../../../core/models/artist.model';
@Component({
  selector: 'app-tracks-page',
  templateUrl: './tracks-page.component.html',
  styleUrls: ['./tracks-page.component.scss']
})
export class TracksPageComponent implements OnInit {

  mockTracksList:AlbumModel[]=[];
  dataArtist:ArtistModel;
  dataArtists:ArtistModel[];
  // TracksTrending:AlbumModel[] = [];
  // TracksRandom:AlbumModel[] = [];

  listObservers$: Subscription[]=[]
  private UuidArtist : string;
  constructor(private capturateParam: ActivatedRoute, private logicService : BusinessLogicService , private trackService : TrackService) {
    this.capturateParam.params.subscribe((resp) => {
       this.UuidArtist=resp['idArtist'];
       this.loadData(this.UuidArtist,logicService.albumCollection);
       this.dataArtist = logicService.getArtistById(this.mockTracksList[0].artistUUID);
       console.log("DATOS DATA ARTIST --> " , this.dataArtist)
    });
   }

  ngOnInit(): void {

    // const observer1$ = this.trackService.dataTracksTrending$.subscribe(response =>{
    //   console.log("Songs Trending -----> ", response)
    //   this.TracksTrending = response;
    // })

    // const observer2$ = this.trackService.dataTracksRandom$.subscribe(response =>{
    //   console.log("New Songs Random -----> ", response)
    //   this.TracksRandom.push(response);
    // })

    // this.listObservers$ = [observer1$,observer2$]
  }
  
  ngOnDestroy(): void {
    this.listObservers$.forEach(res => res.unsubscribe()); 
  }

  loadData(UuidArtist:string , dataAlbums: AlbumModel[]){
    if(UuidArtist !== 'All'){
     this.mockTracksList = dataAlbums.filter((x:any) => x.artistUUID === UuidArtist);
    }else{
     this.mockTracksList = dataAlbums;
    }
  }
}

 //  Swal.fire({
      //    title: 'SUCCESS',
      //    allowOutsideClick: false,
      //    icon: 'success',
      //    text: this.typeArtist 
 //  });
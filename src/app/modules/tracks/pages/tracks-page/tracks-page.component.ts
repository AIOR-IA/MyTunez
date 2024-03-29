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

  

  TitleCard:string = "";
  listObservers$: Subscription[]=[]
  private UuidArtist : string;
  constructor(private capturateParam: ActivatedRoute, private logicService : BusinessLogicService , private trackService : TrackService) {
    this.capturateParam.params.subscribe((resp) => {
       this.UuidArtist=resp['idArtist'];
       this.loadData(this.UuidArtist,logicService.albumCollection);
    });
   }

  ngOnInit(): void {
    const observer1$ =this.trackService.dataFormAlbum$.subscribe(res=>{
      this.loadData(this.UuidArtist,res);
    })
    this.listObservers$ = [observer1$];
  }
  
  ngOnDestroy(): void {
    this.listObservers$.forEach(res => res.unsubscribe()); 
  }

  loadData(UuidArtist:string , dataAlbums: AlbumModel[]){
    if(UuidArtist !== 'All'){
     this.mockTracksList = dataAlbums.filter((x:any) => x.artistUUID === UuidArtist);
     const nameArtist:ArtistModel = this.logicService.getArtistById(UuidArtist);
     if(this.mockTracksList.length===0){
      this.TitleCard = `No recorded albums were found for ${nameArtist?.name}`;
     }else{
       this.TitleCard = `Artist Albums: ${nameArtist?.name}`;
     }
    }else{
     this.mockTracksList = dataAlbums;
     this.TitleCard = "All Albums"
    }
  }
}
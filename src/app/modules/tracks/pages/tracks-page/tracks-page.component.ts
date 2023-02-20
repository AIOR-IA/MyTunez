import { Component, OnInit } from '@angular/core';
import * as dataRaw from '../../../../data/tracks.json';
import { TrackModel } from '../../../../core/models/tracks.model';
import { ActivatedRoute } from '@angular/router';
///Import para alertas de mensaje
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tracks-page',
  templateUrl: './tracks-page.component.html',
  styleUrls: ['./tracks-page.component.scss']
})
export class TracksPageComponent implements OnInit {

  mockTracksList:TrackModel[]=[];
  private typeArtist : string;
  constructor(private capturateParam: ActivatedRoute) {
    this.capturateParam.params.subscribe((resp) => {
       console.log(resp['idArtist']) ;
       
       this.typeArtist=resp['idArtist'];
       //load data localStorage
       const {data}:any = (dataRaw as any).default;
       console.log(this.typeArtist);
       if(this.typeArtist !== 'ALL'){
        this.mockTracksList = data.filter((x:any) => x.album === this.typeArtist);
       }else{
        this.mockTracksList = data;
       }
       Swal.fire({
         title: 'SUCCESS',
         allowOutsideClick: false,
         icon: 'success',
         text: this.typeArtist 
       });
    });
   }

  ngOnInit(): void {
    // const {data}:any = (dataRaw as any).default;
    // console.log(this.typeArtist);
    // this.mockTracksList = data;
    
  }

}

import { Component, OnInit } from '@angular/core';
import { BusinessLogicService } from '../../../../shared/services/business-logic.service';
import { ArtistModel } from '@core/models/artist.model';
import { AlbumModel } from '../../../../core/models/album.model';
import { SongModel } from '../../../../core/models/song.model';
import { ActivatedRoute } from '@angular/router';
import { TrackService } from '../../../tracks/services/track.service';

@Component({
  selector: 'app-favorite-page',
  templateUrl: './favorite-page.component.html',
  styleUrls: ['./favorite-page.component.scss']
})
export class FavoritePageComponent implements OnInit {
  public DataArtist:ArtistModel;
  public DataAlbum: AlbumModel;
  public DataSongs:SongModel[];
  private artistUuid:string="";
  private albumUuid:string="";
  constructor(private logicService: BusinessLogicService , private capturateParam:ActivatedRoute) {
    this.capturateParam.params.subscribe((resp) => {
      this.artistUuid = resp['idArtist'];
      this.albumUuid  = resp['idAlbum'];
      this.DataArtist = logicService.getArtistById(this.artistUuid);
      this.DataAlbum = logicService.getAlbumById(this.albumUuid);
      this.DataSongs = logicService.getSongsByidAlbum(this.albumUuid);
       // devuelve todos los albums
       
   });
   }

  ngOnInit(): void {
 
  }

}

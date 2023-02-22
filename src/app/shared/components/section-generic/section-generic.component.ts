import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { AlbumModel } from '@core/models/album.model';
import { ArtistModel } from '../../../core/models/artist.model';

@Component({
  selector: 'app-section-generic',
  templateUrl: './section-generic.component.html',
  styleUrls: ['./section-generic.component.scss']
})
export class SectionGenericComponent implements OnInit {
  @Input() title: string ='';
  @Input() mode: 'small' |'big' = 'big';
  @Input() dataAlbum: AlbumModel[]=[];


  @Input() dataArtist: ArtistModel;
  @Input() dataArtists: ArtistModel[];
  
  constructor() { }

  ngOnInit(): void {
    
  }
}

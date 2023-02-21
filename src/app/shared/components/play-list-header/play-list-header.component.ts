import { Component, Input, OnInit } from '@angular/core';
import { AlbumModel } from '../../../core/models/album.model';

@Component({
  selector: 'app-play-list-header',
  templateUrl: './play-list-header.component.html',
  styleUrls: ['./play-list-header.component.scss']
})
export class PlayListHeaderComponent implements OnInit {



  @Input() nameArtist: string;
  @Input() TotalSongs: number;
  @Input() dataAlbum: AlbumModel;
  constructor() { }

  ngOnInit(): void {
  }

}

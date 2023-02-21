import { Component, OnInit } from '@angular/core';
import { ArtistModel } from '@core/models/artist.model';
import { BusinessLogicService } from '@shared/services/business-logic.service';

@Component({
  selector: 'app-sides-bar',
  templateUrl: './sides-bar.component.html',
  styleUrls: ['./sides-bar.component.scss']
})
export class SidesBarComponent implements OnInit {

  mainMenu: {
    defaultOptions: Array<any>, accessLink: Array<any>
  } = { defaultOptions: [], accessLink: [] }

  customOptions: ArtistModel[] = []

  private firstElement:ArtistModel ={
    artistUUID: "All",
    name: "All Artists",
    genres: [],
    members: "",
    website: "",
    image: ""
}
Artist : ArtistModel[]=[];
constructor(private logicService : BusinessLogicService) { 
    this.Artist= logicService.artistCollection;
    console.log(this.Artist);
}
  linksMenu: any[] = [
    {
      name:'Home',
      icon:'fa-house'
    },
    {
      name:'Search',
      icon:'fa-magnifying-glass'
    }
  ]


  ngOnInit(): void {
    this.mainMenu.defaultOptions = [
      {
        name: 'Home',
        icon: 'fa-house',
        router: ['/', 'auth']
      },
      {
        name: 'Search',
        icon: 'fa-magnifying-glass',
        router: ['/', 'tracks']
      },
      {
        name: 'Your Library',
        icon: 'fa-book',
        router: ['/', 'favorites'],
        query: { hola: 'mundo' }
      }
    ]

    this.mainMenu.accessLink = [
      {
        name: 'Create Artist',
        icon: 'fa-square-plus'
      },
      {
        name: 'Liked Songs',
        icon: 'fa-hand-holding-heart'
      }
    ]

    this.customOptions = this.Artist; 
    this.customOptions.unshift(this.firstElement);
  }
}

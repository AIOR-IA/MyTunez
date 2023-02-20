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

  customOptions: Array<any> = []


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
   Artist : ArtistModel[]=[];
  constructor(private logic : BusinessLogicService) { 
      this.Artist= logic.artistCollection;
      console.log(this.Artist[0].image);
  }

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

    this.customOptions = [
      {
        name: 'ALL',
        router: ['/']
      },
      {
        name: this.Artist[0].name,
        router: ['/']
      },
      {
        name: 'One Love',
        router: ['/']
      },
      {
        name: 'Mi lista º4',
        router: ['/']
      }
    ]


  }

}

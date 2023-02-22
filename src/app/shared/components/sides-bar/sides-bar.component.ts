import {Component, OnInit} from '@angular/core';
import {ArtistModel} from '@core/models/artist.model';
import {BusinessLogicService} from '@shared/services/business-logic.service';
import {MatDialog} from '@angular/material/dialog';
import {RegistrationFormComponent} from "@shared/components/registration-form/registration-form.component";
import { TrackService } from '@modules/tracks/services/track.service';

@Component({
  selector: 'app-sides-bar',
  templateUrl: './sides-bar.component.html',
  styleUrls: ['./sides-bar.component.scss']
})
export class SidesBarComponent implements OnInit {

  mainMenu: {
    defaultOptions: Array<any>, accessLink: Array<any>
  } = {defaultOptions: [], accessLink: []}


  customOptions: Array<any> = []
  Artist: ArtistModel[] = [];

  private firstElement:ArtistModel ={
    artistUUID: "All",
    name: "All Artists",
    genres: [],
    members: "",
    website: "",
    image: ""
}

  constructor(private logic: BusinessLogicService, public dialog: MatDialog , private trackService: TrackService) {
    this.Artist = logic.artistCollection;
  }


  ngOnInit(): void {
    this.mainMenu.defaultOptions = [
      {
        name: 'Home',
        icon: 'fa-house',
        router: ['/', 'auth']
      },
    ]

    this.mainMenu.accessLink = [
      {
        name: 'Create Artist',
        icon: 'fa-square-plus'
      },
      // {
      //   name: 'Liked Songs',
      //   icon: 'fa-hand-holding-heart'
      // }
    ]

    this.customOptions = [
      {
        name: 'ALL ARTISTS',
        router: ['/']
      },
      {
        name: 'Pepe Aguilar',
        router: ['/']
      },
    ]

    this.customOptions = this.Artist; 
    this.customOptions.unshift(this.firstElement);

    const observer1$ =this.trackService.dataFormArtist$.subscribe(res=>{
      this.customOptions = res;
    })


  }

  addPopUpContext() {
    console.log("contexto")
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegistrationFormComponent, {
      height: '770px',
      width: '550px',

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

}

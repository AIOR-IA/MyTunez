import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArtistModel} from '@core/models/artist.model';
import {BusinessLogicService} from '@shared/services/business-logic.service';
import {MatDialog} from '@angular/material/dialog';
import {RegistrationFormComponent} from "@shared/components/registration-form/registration-form.component";
import { TrackService } from '@modules/tracks/services/track.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sides-bar',
  templateUrl: './sides-bar.component.html',
  styleUrls: ['./sides-bar.component.scss']
})
export class SidesBarComponent implements OnInit, OnDestroy {

  mainMenu: {
    defaultOptions: Array<any>, accessLink: Array<any>
  } = {defaultOptions: [], accessLink: []}


  customOptions: Array<any> = []
  Artist: ArtistModel[] = [];
  listObservers$: Subscription[]=[]

  constructor(private logicService: BusinessLogicService, public dialog: MatDialog , private trackService: TrackService) {
    this.Artist = logicService.artistCollection;
  }
  
  ngOnInit(): void {
    this.mainMenu.defaultOptions = [
      {
        name: 'Home',
        icon: 'fa-house',
        router: ['/tracks', 'All']
      },
    ]

    this.mainMenu.accessLink = [
      {
        name: 'Create Artist',
        icon: 'fa-square-plus'
      }
    ]

    this.customOptions = this.Artist; 
    
    this.createArtistDefault();
    
    const observer1$ =this.trackService.dataFormArtist$.subscribe(res=>{
      this.customOptions = res;
      this.createArtistDefault();
    })
    this.listObservers$ = [observer1$];
  }
  ngOnDestroy(): void {
    this.listObservers$.forEach(res => res.unsubscribe());
  }

  addPopUpContext() {
    console.log("contexto")
    this.openDialog();
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(RegistrationFormComponent, {
      height: '750px',
      width: '550px',

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }
  
  createArtistDefault():void {
    let firstElement:ArtistModel ={
      artistUUID: "All",
      name: "All Artists",
      genres: [],
      members: "",
      website: "",
      image: ""}
    this.customOptions.unshift(firstElement);
  }
}

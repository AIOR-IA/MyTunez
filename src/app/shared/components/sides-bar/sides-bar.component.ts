import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArtistModel} from '@core/models/artist.model';
import {BusinessLogicService} from '@shared/services/business-logic.service';
import {MatDialog} from '@angular/material/dialog';
import {RegistrationFormComponent} from "@shared/components/registration-form/registration-form.component";
import { TrackService } from '@modules/tracks/services/track.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MultimediaService } from '../../services/multimedia.service';

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

  constructor(
    private logicService: BusinessLogicService,
    public dialog: MatDialog ,
    private trackService: TrackService,
    private router: Router,
    private multimediaService: MultimediaService,
  ) {
    this.Artist = logicService.artistCollection;
    router.navigate(['/tracks', 'All']);
  }

  ngOnInit(): void {
    // this.multimediaService.deleteStateCurrentSong();
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
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegistrationFormComponent, {
      height: '750px',
      width: '550px',

    });
    dialogRef.afterClosed().subscribe(result => {

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

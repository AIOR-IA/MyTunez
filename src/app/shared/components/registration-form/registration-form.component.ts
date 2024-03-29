import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {GenreModel} from "@core/models/genre.model";
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ArtistModel} from "@core/models/artist.model";
import {RegistrationLogicService} from "@shared/services/registration-logic.service";
import {BusinessLogicService} from "@shared/services/business-logic.service";
import * as dropdownYears from '../../../data/dropdown-years.json'
import {YearModel} from "@core/models/year.model";
import {AlbumModel} from "@core/models/album.model";

import Swal from 'sweetalert2';
import { TrackService } from '../../../modules/tracks/services/track.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  public registerArtistForm!: FormGroup;
  public registerAlbumForm!: FormGroup;
  public registerSongForm!: FormGroup;
  public genres: Array<GenreModel> = [];
  public artists: Array<ArtistModel> = [];
  public albums: Array<AlbumModel> = [];
  public displaySpinnerArtist = false;
  public displayButtonArtist = true;
  public displaySpinnerAlbum = false;
  public displayButtonAlbum = true;
  public displaySpinnerSong = false;
  public displayButtonSong = true;

  public dropdownYears: Array<YearModel> = [];

  constructor(public dialogRef: MatDialogRef<RegistrationFormComponent>,
              private logic: BusinessLogicService,
              private registrationLogic: RegistrationLogicService,
              private trackService: TrackService
  ) {
  }


  ngOnInit() {
    this.loadArtistForm();
    this.loadAlbumForm();
    this.loadSongForm();
    this.getDropdownYears();
    this.getGenres();
    this.getArtists();

  }

  loadArtistForm() {
    this.registerArtistForm = new FormGroup({
        name: new FormControl(null, [Validators.required, this.validationBlankSpace()]),
        genres: new FormControl(null, Validators.required),
        members: new FormControl(null, [Validators.required, this.validationBlankSpace()]),
        website: new FormControl(null, [Validators.required, this.validationBlankSpace()]),
        image: new FormControl(null, [Validators.required, this.requiredFileType(["jpg", "png", "jpeg"])])

      }
    );
  }

  loadAlbumForm() {
    this.registerAlbumForm = new FormGroup({
        title: new FormControl(null, [Validators.required, this.validationBlankSpace()]),
        genre: new FormControl(null, Validators.required),
        year: new FormControl(null, [Validators.required, this.validationBlankSpace()]),
        artist: new FormControl(null, Validators.required),
        imageCover: new FormControl(null, [Validators.required, this.requiredFileType(["jpg", "png", "jpeg"])])
      }
    );
  }

  loadSongForm() {
    this.registerSongForm = new FormGroup({
        title: new FormControl(null, [Validators.required, this.validationBlankSpace()]),
        genre: new FormControl(null, Validators.required),
        year: new FormControl(null, [Validators.required, this.validationBlankSpace()]),
        artist: new FormControl(null, Validators.required),
        album: new FormControl(null, Validators.required),

        linkSong: new FormControl(null, [Validators.required, this.requiredFileType(["mp3"])]),
      }
    );
  }

  validationBlankSpace(): ValidatorFn  {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const text = control.value;

      if (text) {
        if (text.trim().length == 0) {
          return {
            empty: true
          };
        }
        return null;
      }
      return null;
    };
  }

  requiredFileType(type: string[]) {
    return function (control: AbstractControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        let coincidenceFound: number = 0;
        for (var val of type) {


          if (val.toLowerCase() === extension.toLowerCase()) {
            coincidenceFound++;
          }
        }


        if (coincidenceFound === 0) {
          return {
            requiredFileType: true
          };
        } else {
          return null;
        }
      } else {
        return null
      }
    }
  }

  get artistForm() {
    return this.registerArtistForm.controls;
  }

  get albumForm() {
    return this.registerAlbumForm.controls;
  }

  get songForm() {
    return this.registerSongForm.controls;
  }

  getGenres() {
    this.genres = this.logic.genreCollection;
  }

  getArtists() {
    this.artists = this.logic.artistCollection;
  }

  getAlbumsFromArtist(artistUUID: string) {
    this.registerSongForm.get("album")?.reset()

    this.albums = this.logic.getAlbums(artistUUID);


  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  // ARTIST
  onSubmitArtist() {
    if (!this.registerArtistForm.invalid) {
      this.showSpinner("artist")
      this.registrationLogic.registerArtist(this.artistForm).then((res) => {
        this.hideSpinner("artist")
        this.getArtists()

        this.registerArtistForm.reset()
        this.messagePopup("Artist was registered", "SUCCESSFUL");
        this.trackService.updateDataArtist();
      });
    }
  }

  // ALBUM
  onSubmitAlbum() {
    if (!this.registerAlbumForm.invalid) {
      this.showSpinner("album")
      this.registrationLogic.registerAlbum(this.albumForm).then((res) => {
        this.hideSpinner("album");
        this.registerAlbumForm.reset();
        this.messagePopup("Album was registered", "SUCCESSFUL");
        this.trackService.updateDataAlbum();
      });
    }
  }

  // SONG

  onSubmitSong() {
    if (!this.registerSongForm.invalid) {
      this.showSpinner("song")
      this.registrationLogic.registerSong(this.songForm).then((res) => {
        this.hideSpinner("song")
        this.registerSongForm.reset()
        this.messagePopup("Song was registered", "SUCCESSFUL");
        this.trackService.updateDataSong();
      });
    }
  }

  // SPINNER ARTIST
  showSpinner(type: string) {
    if (type === "artist") {
      this.displaySpinnerArtist = true;
      this.displayButtonArtist = false;
    }
    if (type === "album") {
      this.displaySpinnerAlbum = true;
      this.displayButtonAlbum = false;
    }
    if (type === "song") {
      this.displaySpinnerSong = true;
      this.displayButtonSong = false;
    }

  }

  hideSpinner(type: string) {
    if (type === "artist") {
      this.displaySpinnerArtist = false;
      this.displayButtonArtist = true;
    }
    if (type === "album") {
      this.displaySpinnerAlbum = false;
      this.displayButtonAlbum = true;
    }
    if (type === "song") {
      this.displaySpinnerSong = false;
      this.displayButtonSong = true;
    }
  }


  getDropdownYears() {
    this.dropdownYears = (dropdownYears as any).default
  }

  messagePopup(text: string, type: string) {
    Swal.fire({
      title: type,
      allowOutsideClick: false,
      background:'rgba(30,30,30,1)',
      color: '#fff',
      icon: 'success',
      text: text
    });
  }

}

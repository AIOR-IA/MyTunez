import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '@shared/services/firebase-storage.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  fileError = false;

  path: string;
  imageName: string;
  imageType = '';
  downloadURL: string;
  constructor(private firebaeStorageService: FirebaseStorageService) { }

  ngOnInit(): void {
  }
  upload($event:any): void {
    this.fileError = false;
    
    this.path = $event.target.files[0];
    this.imageType = $event.target.files[0].type;
    this.getDuration(this.path);
  }
  CargarArchivosWeb() {
    
    console.log(uuidv4());
    //  this.firebaeStorageService.UploadImages(this.path);
    
  }
  getDuration(file:any) {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.round(duration % 60);
      console.log('Duration:', minutes, 'minutes', seconds, 'seconds');
    });
    audio.src = URL.createObjectURL(file);
  }

}

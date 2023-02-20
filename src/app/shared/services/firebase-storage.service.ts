import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor(private readonly angularFireStorage: AngularFireStorage) { }

  UploadImages(images:string) {
    const path = `Images/Song/LuisMiguel`;
    const fileRef = this.angularFireStorage.ref(path);
    
    this.angularFireStorage.upload(path, images).then(()=>{
      fileRef.getDownloadURL().subscribe(url =>{
        console.log(`UPLOADING IMAGE `);
        let pathImage:string = url;
        console.log(url);
      })
    }).catch( error =>{
      console.log(error);
    })

  }
}

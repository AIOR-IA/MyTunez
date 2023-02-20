import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { SongsComponent } from './components/songs/songs.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

//firebase
import { AngularFireModule } from '@angular/fire'
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MediaPlayerComponent,
    SideBarComponent,
    AlbumsComponent,
    SongsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

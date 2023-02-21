import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidesBarComponent } from '@shared/components/sides-bar/sides-bar.component';
import { HomePageComponent } from './pages/home-page/home-page.component';


const routes: Routes = [
  {
    path:'tracks/:idArtist',
    loadChildren:() => import(`@modules/tracks/tracks.module`).then(module => module.TracksModule)
  },
  {
    path:'history',
    loadChildren:() => import(`@modules/history/history.module`).then(module => module.HistoryModule)
  },
  {
    path:'favorites/:idArtist/:idAlbum',
    loadChildren:() => import(`@modules/favorites/favorites.module`).then(module => module.FavoritesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

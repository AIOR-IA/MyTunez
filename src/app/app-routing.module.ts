import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from '@modules/home/pages/home-page/home-page.component';
import { SidesBarComponent } from '@shared/components/sides-bar/sides-bar.component';

const routes: Routes = [
  {
    path:'',
    component:HomePageComponent,
    loadChildren:() => import(`./modules/home/home.module`).then(module => module.HomeModule)
  },{
    path:'**',
    component: SidesBarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

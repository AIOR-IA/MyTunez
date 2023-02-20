import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryPagesComponent } from './pages/history-pages/history-pages.component';

const routes: Routes = [
  {
    path:'',
    component:HistoryPagesComponent,
    outlet:'router__child'
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }

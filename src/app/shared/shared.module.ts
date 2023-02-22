import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidesBarComponent} from './components/sides-bar/sides-bar.component';
import {MediaPlayerComponent} from './components/media-player/media-player.component';
import {HeaderUserComponent} from './components/header-user/header-user.component';
import {CardPlayerComponent} from './components/card-player/card-player.component';
import {SectionGenericComponent} from './components/section-generic/section-generic.component';
import {PlayListHeaderComponent} from './components/play-list-header/play-list-header.component';
import {PlayListBodyComponent} from './components/play-list-body/play-list-body.component';
import {RouterModule} from '@angular/router';
import {OrderListPipe} from './pipe/order-list.pipe';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RegistrationFormComponent} from './components/registration-form/registration-form.component';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatGridListModule} from "@angular/material/grid-list";
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSliderModule} from "@angular/material/slider";


@NgModule({
  declarations: [
    SidesBarComponent,
    MediaPlayerComponent,
    HeaderUserComponent,
    CardPlayerComponent,
    SectionGenericComponent,
    PlayListHeaderComponent,
    PlayListBodyComponent,
    OrderListPipe,
    RegistrationFormComponent,
    FileUploadComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        //  MATERIAL  -- //
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        // ------------- //
        FormsModule,
        MatTabsModule,
        MatOptionModule,
        MatSelectModule,
        MatIconModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatGridListModule,
        MatProgressSpinnerModule,
        MatSliderModule
    ],
  exports: [
    SidesBarComponent,
    MediaPlayerComponent,
    HeaderUserComponent,
    CardPlayerComponent,
    SectionGenericComponent,
    PlayListHeaderComponent,
    PlayListBodyComponent
  ]
})
export class SharedModule {
}

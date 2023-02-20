import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';

@Component({
  selector: 'app-section-generic',
  templateUrl: './section-generic.component.html',
  styleUrls: ['./section-generic.component.scss']
})
export class SectionGenericComponent implements OnInit {
  @Input() title: string ='';
  @Input() mode: 'small' |'big' = 'big';
  @Input() dataTracks: TrackModel[]=[];


  constructor() { }

  ngOnInit(): void {
  }

}

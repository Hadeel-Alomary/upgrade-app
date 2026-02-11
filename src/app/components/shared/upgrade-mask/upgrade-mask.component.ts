import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'upgrade-mask',
  templateUrl: './upgrade-mask.component.html',
  styleUrls: ['./upgrade-mask.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UpgradeMaskComponent implements OnInit {

    @Input() show: boolean;
    @Input() height: number;
    @Input() isChart: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}

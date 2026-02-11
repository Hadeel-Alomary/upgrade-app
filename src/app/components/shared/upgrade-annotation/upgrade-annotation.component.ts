import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'upgrade-annotation',
  templateUrl: './upgrade-annotation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UpgradeAnnotationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

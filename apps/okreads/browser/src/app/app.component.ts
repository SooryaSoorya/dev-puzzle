import { Component } from '@angular/core';

import { APP_CONSTANTS } from './app.constants';

@Component({
  selector: 'tmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public appConstants;

  constructor() {
    this.appConstants = APP_CONSTANTS;
  }
}

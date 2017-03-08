import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { QuestionerPage } from '../questioner/questioner'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }

  onStartQuestioner() {
    this.navigateToQuestioner();
  }

  private navigateToQuestioner() {
    this.navCtrl.push(QuestionerPage,{categories:['sf']});
  }

}

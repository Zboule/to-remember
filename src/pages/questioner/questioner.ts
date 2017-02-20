import { Component , OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Question } from '../../logic/entity/question.model';
import { QuestionGeneratorService } from '../../logic/services/question-generator.service';

@Component({
  selector: 'page-questioner',
  templateUrl: 'questioner.html'
})
export class QuestionerPage implements OnInit{

  curentQuestion: Question;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public questionGenerator: QuestionGeneratorService) 
  {
  }

  ngOnInit () {
    this.curentQuestion = new Question ();
  }

  ionViewWillEnter() {
    this.getQuestion();    
  }

  private getQuestion () {
    this.curentQuestion = this.questionGenerator.getQuestion();
    console.log(this.curentQuestion);
  }

}

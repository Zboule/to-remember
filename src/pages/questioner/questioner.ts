import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Question } from '../../logic/entities/question';
import { QuestionGeneratorService } from '../../logic/services/question-generator.service';

@Component({
  selector: 'page-questioner',
  templateUrl: 'questioner.html'
})
export class QuestionerPage implements OnInit {

  curentQuestion: Question;
  isAnswerVisibile: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public questionGenerator: QuestionGeneratorService) {
  }

  ngOnInit() {
    this.curentQuestion = new Question(); // Not sure
    this.isAnswerVisibile = false;
  }

  ionViewWillEnter() {
    this.getQuestion();
  }

  clickWrongAnswer() {
    this.curentQuestion.addWrongAnswer();
    this.getQuestion();
  }

  clickCorrectAnswer() {
    this.curentQuestion.addCorrectAnswer();
    this.getQuestion();
  }

  hideAnswer() {
    this.isAnswerVisibile = false;
  }

  showAnswer() {
    this.isAnswerVisibile = true;
  }

  private getQuestion() {
    this.questionGenerator.getQuestion().subscribe(
      (question: Question) => {
        this.setQuestion(question);
      }
    );
  }

  private setQuestion(question: Question) {
    this.hideAnswer();
    this.curentQuestion = question;
  }



}

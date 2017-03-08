import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AcquisitionState } from '../../logic/entities/acquisition-state';

import { Observable } from 'rxjs';

import { Question } from '../../logic/entities/question';

import { QuestionsScheduler } from '../../logic/services/questions-scheduler.service';
import { QuestionsService } from '../../logic/services/questions.service';
import { QuestionsCounter } from '../../logic/services/questions-counter.service';

@Component({
  selector: 'page-questioner',
  templateUrl: 'questioner.html'
})
export class QuestionerPage implements OnInit {

  curentQuestion: Question;
  isAnswerVisibile: boolean;
  acquisitionState = AcquisitionState;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public questionScheduler: QuestionsScheduler,
    public questionService: QuestionsService,
    public questionCounter: QuestionsCounter) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getQuestions().subscribe((questions: Question[]) => {
      this.questionScheduler.setQuestions(questions);
      this.askQuestion()
    });
  }

  clickWrongAnswer() {
    this.curentQuestion.addWrongAnswer();
    this.askQuestion();
  }

  clickCorrectAnswer() {
    this.curentQuestion.addCorrectAnswer();
    this.askQuestion();
  }

  hideAnswer() {
    this.isAnswerVisibile = false;
  }

  showAnswer() {
    this.isAnswerVisibile = true;
  }

  private getQuestions(): Observable<Question[]> {
    let categories: string[];
    categories = this.navParams.get('categories');

    return this.questionService.getQuestionsByCategories(categories);
  }

  private askQuestion() {
    let nextQuestion = this.questionScheduler.getNextQuestion();
    this.setCurentQuestion(nextQuestion);
  }

  private setCurentQuestion(question: Question) {
    this.hideAnswer();
    this.curentQuestion = question;
  }



}

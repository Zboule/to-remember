import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';

import { QuestionerPage } from '../pages/questioner/questioner';

import { QuestionsScheduler } from '../logic/services/questions-scheduler.service';
import { QuestionsService } from '../logic/services/questions.service';
import { QuestionsCounter } from '../logic/services/questions-counter.service';

import { QuestionFactory } from '../logic/factories/question.factory';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QuestionerPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QuestionerPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    QuestionsScheduler,
    QuestionsService,
    QuestionFactory,
    QuestionsCounter
  ]
})
export class AppModule { }

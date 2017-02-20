import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { QuestionerPage } from '../pages/questioner/questioner';

import { QuestionGeneratorService} from '../logic/services/question-generator.service';


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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    QuestionGeneratorService
  ]
})
export class AppModule {}

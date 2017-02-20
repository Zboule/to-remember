import { Injectable } from '@angular/core';

import { Question } from '../entity/question.model'

@Injectable()
export class QuestionGeneratorService {

    getQuestion () : Question {
        let question = new Question ();
        return question;
    }
}

import { Injectable } from '@angular/core';

import { Question } from '../entities/question';

@Injectable()
export class QuestionFactory {

    constructor() { }

    createQuestionFromJsonData(jsonData: any): Question {
        let question: Question = new Question();

        //TODO: Mieux gérer les set et les get
        question.answer = jsonData.answer;
        question.question = jsonData.question;
        question.categories = jsonData.categories;
        return question;
    }
}
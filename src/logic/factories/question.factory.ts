import { Injectable } from '@angular/core';

import { Question } from '../entities/question';

import {QuestionsCounter} from '../services/questions-counter.service'

@Injectable()
export class QuestionFactory {

    constructor(
        private questionsCounter : QuestionsCounter
    ) { }

    createQuestionFromJsonData(jsonData: any): Question {
        let question: Question = new Question(this.questionsCounter);

        question.answer = jsonData.answer;
        question.question = jsonData.question;
        question.categories = jsonData.categories;
        
        return question;
    }
}
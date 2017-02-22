import { Injectable } from '@angular/core';

import { Observable, Subscriber } from 'rxjs';

import { Question } from '../entities/question';
 
import { QuestionFactory } from '../factories/question.factory';
import { QUESTIONS } from '../../mocks/mock-data';

@Injectable()
export class QuestionsService {

    constructor(
         private questionFactory:QuestionFactory
    ) {
    }

    getQuestionsByCategories(categories: string[]): Observable<Question[]> {
        return this.getAllQuestions().map(
            questions => this.filterQuestionsByCategories(questions, categories)
        );
    }

    getAllQuestions(): Observable<Question[]> {
        let questions: Question[] = [];

        for (let jsonQuestion of QUESTIONS) {
            questions.push(this.questionFactory.createQuestionFromJsonData(jsonQuestion))
        }

        return new Observable<Question[]>(
            (subscriber: Subscriber<Question[]>) => subscriber.next(questions)
        );
    }

    private filterQuestionsByCategories(questions: Question[], categories: string[]): Question[] {
        return questions.filter(
            (question: Question) => this.doesQuestionMatchCategories(question, categories)
        )
    }

    private doesQuestionMatchCategories(question: Question, categories: string[]): boolean {
        let matchCategories = false;

        for (let category of categories) {
            if (question.hasCategory(category)) {
                matchCategories = true;
                break;
            }
        }
        return matchCategories;
    }
}
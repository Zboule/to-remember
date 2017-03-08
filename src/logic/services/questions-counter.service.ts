import { Injectable } from '@angular/core';

import { QUESTIONS_COUNTER } from '../../mocks/mock-data';

@Injectable()
export class QuestionsCounter {

    questionCounter: number;

    constructor() { 
        this.questionCounter = QUESTIONS_COUNTER;
    }

    increment () {
        this.questionCounter ++;
    }

    getQuestionsCount () : number {
        return this.questionCounter;
    }
}
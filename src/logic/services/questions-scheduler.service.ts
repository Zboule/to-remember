import { Injectable } from '@angular/core';

import { Question } from '../entities/question';
import { AcquisitionState } from '../entities/acquisition-state';

import { Subscription } from 'rxjs';

import { QuestionsCounter } from './questions-counter.service'

@Injectable()
export class QuestionsScheduler {


    private newQuestions: Question[];
    private nonAcquiredQuestions: Question[];
    private inCourseOfAcquisitionQuestions: Question[];
    private acquiredQuestions: Question[];

    private questionSequence: Question[][];

    private subscriptions: Subscription[];



    constructor(
        private questionsCounter: QuestionsCounter
    ) {
        this.newQuestions = [];
        this.nonAcquiredQuestions = [];
        this.inCourseOfAcquisitionQuestions = [];
        this.acquiredQuestions = [];
        this.subscriptions = [];
    }

    setQuestions(questions: Question[]) {
        this.initQuestionSequence();
        this.unsubscribeAllSubscriptions();

        for (let question of questions) {
            this.addQuestion(question);
            this.defineObservableQuestion(question);
        }
    }


    getNextQuestion(): Question {
        let nextQuestionsSubSet: Question[];
        nextQuestionsSubSet = this.getNextSubSetOfQuestions();

        let nextQuestion: Question;
        nextQuestion = this.getNextQuestionInSubset(nextQuestionsSubSet);
        if (!nextQuestion) {
            nextQuestion = this.getNextQuestion();
            this.questionsCounter.increment();
        }

        return nextQuestion;
    }

    private getNextSubSetOfQuestions(): Question[] {
        let questionsSubSet: Question[];
        questionsSubSet = this.questionSequence.shift();
        this.questionSequence.push(questionsSubSet);
        return questionsSubSet;
    }

    private unsubscribeAllSubscriptions() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptions = [];
    }

    private defineObservableQuestion(question: Question) {
        let observableQuestion = question.getObservableQuestion();
        let subscription = observableQuestion.subscribe((question: Question) => {
            this.onObservableQuestionEmmit(question);
        }
        );
        this.subscriptions.push(subscription);
    }

    private onObservableQuestionEmmit(question: Question) {
        this.addQuestion(question);
        this.sortQuestionsByAnswerDate(question.acquisitionState);
    }

    private sortQuestionsByAnswerDate(acquisitionState: AcquisitionState) {
        if (acquisitionState === AcquisitionState.new) {
            this.sortQuestionByAnswerDate(this.acquiredQuestions)
        } else if (acquisitionState === AcquisitionState.nonAcquired) {
            this.sortQuestionByAnswerDate(this.nonAcquiredQuestions)
        } else if (acquisitionState === AcquisitionState.inCourseOfAcquisition) {
            this.sortQuestionByAnswerDate(this.inCourseOfAcquisitionQuestions)
        } else if (acquisitionState === AcquisitionState.acquired) {
            this.sortQuestionByAnswerDate(this.acquiredQuestions)
        }
    }

    private addQuestion(question: Question) {
        if (question.acquisitionState === AcquisitionState.new) {
            this.newQuestions.push(question);
        } else if (question.acquisitionState === AcquisitionState.nonAcquired) {
            this.nonAcquiredQuestions.push(question);
        } else if (question.acquisitionState === AcquisitionState.inCourseOfAcquisition) {
            this.inCourseOfAcquisitionQuestions.push(question);
        } else if (question.acquisitionState === AcquisitionState.acquired) {
            this.acquiredQuestions.push(question);
        }
    }

    private initQuestionSequence() {
        this.questionSequence = [];
        this.questionSequence.push(this.newQuestions);
        this.questionSequence.push(this.newQuestions);
        this.questionSequence.push(this.nonAcquiredQuestions);
        this.questionSequence.push(this.nonAcquiredQuestions);
        this.questionSequence.push(this.inCourseOfAcquisitionQuestions);
        this.questionSequence.push(this.inCourseOfAcquisitionQuestions);
        this.questionSequence.push(this.inCourseOfAcquisitionQuestions);
        this.questionSequence.push(this.acquiredQuestions);
    }

    private getNextQuestionInSubset(questionsSubSet: Question[]): Question {

        let nextQuestion: Question;
        let minAgeInSecond = 30

        if ( questionsSubSet.length > 0 && questionsSubSet[0].getLastAnserOrderFromGrobalLastAnswer() > 0) {
            nextQuestion = questionsSubSet.shift();
        } else {
            nextQuestion = undefined
        }

        return nextQuestion;
    }

    private nextQuestionInSubsetIsValidQuestion (questionsSubSet: Question []) {
        let minQuestionOrder : number = 4;
        let isValidQuestion : boolean = true;

        if (questionsSubSet.length < 0) {
            isValidQuestion = false;
        }
        if (this.questionsCounter.getQuestionsCount() > minQuestionOrder) {
            
        }

        return isValidQuestion;
    }

    private sortQuestionByAnswerDate(questions: Question[]) {
        return questions.sort((questionA: Question, questionB: Question) => {
            return questionA.compareByAnserOrder(questionB);
        })
    }
}
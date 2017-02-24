import { Injectable } from '@angular/core';

import { Question } from '../entities/question';
import { AcquisitionState } from '../entities/acquisition-state';

import { Observable, Observer, Subscription } from 'rxjs';

@Injectable()
export class QuestionScheduler {


    private newQuestions: Question[];
    private nonAcquiredQuestions: Question[];
    private inCourseOfAcquisitionQuestions: Question[];
    private acquiredQuestions: Question[];

    private questionSequence: Function[];

    private subscriptions: Subscription[]

    constructor() {
        this.initQuestionSequence();
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
        let questionGetter = this.questionSequence.shift();

        let nextQuestion = questionGetter();

        this.questionSequence.push(questionGetter);

        return nextQuestion;
    }

    private unsubscribeAllSubscriptions() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptions = [];
    }
    private defineObservableQuestion(question: Question) {
        let subscription = new Observable<Question>(
            (observer: Observer<Question>) => question.addQuestionHaveNewAnswerObserver(observer)
        ).subscribe(this.onObservableQuestionEmmit);
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
        this.questionSequence.push(this.getNextNewQuestion);
        this.questionSequence.push(this.getNextNewQuestion);
        this.questionSequence.push(this.getNextNonAcquiredQuestion);
        this.questionSequence.push(this.getNextNonAcquiredQuestion);
        this.questionSequence.push(this.getNextInCourseOfAcquisitionQuestion);
        this.questionSequence.push(this.getNextInCourseOfAcquisitionQuestion);
        this.questionSequence.push(this.getNextInCourseOfAcquisitionQuestion);
        this.questionSequence.push(this.getNextAcquiredQuestion);
    }

    private getNextNewQuestion(): Question {
        return this.findNextQuestion(this.nonAcquiredQuestions);
    }

    private getNextNonAcquiredQuestion(): Question {
        return this.findNextQuestion(this.nonAcquiredQuestions);
    }

    private getNextInCourseOfAcquisitionQuestion(): Question {
        return this.findNextQuestion(this.inCourseOfAcquisitionQuestions);
    }

    private getNextAcquiredQuestion(): Question {
        return this.findNextQuestion(this.nonAcquiredQuestions);
    }

    private findNextQuestion(questionsSubSet: Question[]): Question {

        let nextQuestion: Question;
        let minAgeInSecond = 30

        if (questionsSubSet.length > 0 && questionsSubSet[0].getLastUserAnswerAgeInSeconde() < minAgeInSecond) {
            nextQuestion = questionsSubSet[0];
        }

        return nextQuestion;
    }

    private sortQuestionByAnswerDate(questions: Question[]) {
        return questions.sort((questionA: Question, questionB: Question) => {
            return questionA.getLastUserAnswerDate().getTime() - questionB.getLastUserAnswerDate().getTime();
        })
    }
}
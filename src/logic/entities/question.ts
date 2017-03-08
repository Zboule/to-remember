import { UserAnswer } from './user-answer';
import { AcquisitionState } from './acquisition-state';

import { Observer, Observable } from 'rxjs';

import { QuestionsCounter } from '../services/questions-counter.service'

export class Question {

    categories: string[];

    acquisitionState: AcquisitionState;

    question: string;
    answer: string;

    userAnswer: UserAnswer[];

    observers: Observer<Question>[];

    constructor(
        private questionsCounter: QuestionsCounter
    ) {
        this.question = undefined;
        this.answer = undefined;
        this.userAnswer = [];
        this.userAnswer = []
        this.categories = [];
        this.observers = [];
        this.setAcquisitionState();
    }

    hasCategory(categoryName: string): boolean {
        return undefined !== this.categories.find(
            value => value === categoryName
        )
    }

    addCorrectAnswer(): void {
        this.addNewUserAnswer(true);
    }

    addWrongAnswer(): void {
        this.addNewUserAnswer(false);
    }

    getLastUserAnswerAgeInSeconde(): number {
        if (this.hasUserAnswer()) {
            return new Date().getTime() - this.getLastUserAnswerDate().getTime();
        } else {
            return undefined;
        }
    }

    getLastUserAnswerDate(): Date {
        if (this.hasUserAnswer()) {
            return this.getLastUserAnswer().date;
        } else {
            return undefined;
        }
    }

    getObservableQuestion(): Observable<Question> {
        return new Observable<Question>(
            (observer: Observer<Question>) => this.addObserver(observer)
        );//TODO: Les observers ne sont jamais retirés :p
    }

    compareByAnserOrder(otherQuestion: Question): number {
        return this.getLastQuestionNumber() - otherQuestion.getLastQuestionNumber();
    }

    getLastQuestionNumber(): number {
        let lastAnswer = this.getLastUserAnswer();
        if (lastAnswer !== undefined) {
            return lastAnswer.questionNumber;
        }
        else {
            return 0;
        }
    }

    getLastAnserOrderFromGrobalLastAnswer (): number {
       return this.getLastQuestionNumber() - this.questionsCounter.getQuestionsCount ();
    }

    private getLastUserAnswer() {
        let lastUserAnswer = undefined;
        if (this.userAnswer.length > 0) {
            lastUserAnswer = this.userAnswer[this.userAnswer.length - 1];
        }
        return lastUserAnswer;
    }
    private addObserver(observer: Observer<Question>) {
        this.observers.push(observer);
    }

    private setAcquisitionState() {
        if (this.userAnswer.length === 0) {
            this.acquisitionState = AcquisitionState.new;
        } else {
            let numberOfAnswerToConsiderate = 3;
            if (this.userAnswer.length < numberOfAnswerToConsiderate) {
                this.acquisitionState = AcquisitionState.nonAcquired;
            } else {
                let numberOfLastGoodAnswer = this.getNumberOfGoodAnswerInLastAnswers(numberOfAnswerToConsiderate);
                if (numberOfLastGoodAnswer / numberOfAnswerToConsiderate < 0.5) {
                    this.acquisitionState = AcquisitionState.nonAcquired;
                } else if (numberOfLastGoodAnswer / numberOfAnswerToConsiderate < 1) {
                    this.acquisitionState = AcquisitionState.inCourseOfAcquisition;
                } else {
                    this.acquisitionState = AcquisitionState.acquired;
                }
            }
        }
    }

    private getNumberOfGoodAnswerInLastAnswers(numberOfAnswerToConsiderate) {
        let numberOfGoodAnswerInLastAnswers = 0;
        for (let i = this.userAnswer.length - 1; numberOfAnswerToConsiderate > 0; i--) {
            if (this.userAnswer[i].isGoodAnswer) {
                numberOfGoodAnswerInLastAnswers++;
            }
            numberOfAnswerToConsiderate--;
        }
        return numberOfGoodAnswerInLastAnswers;
    }

    private addNewUserAnswer(isGoodAnswer: boolean) {
        const newUserAnswer = new UserAnswer(this.questionsCounter.getQuestionCount(), isGoodAnswer);
        this.userAnswer.push(newUserAnswer);
        this.setAcquisitionState();
        this.notifiyObserver();
    }

    private notifiyObserver() {
        this.observers.forEach(observer => observer.next(this));
    }

    hasUserAnswer(): boolean {
        return this.userAnswer.length !== 0;
    }
}
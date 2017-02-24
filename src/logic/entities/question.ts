import { UserAnswer } from './user-answer';
import { AcquisitionState } from './acquisition-state';

import { Observer } from 'rxjs';

export class Question {

    categories: string[];

    acquisitionState: AcquisitionState;

    question: string;
    answer: string;

    userAnswer: UserAnswer[];

    questionHaveNewAnswerObserver: Observer<Question>[];

    constructor() {
        this.question = undefined;
        this.answer = undefined;
        this.setAcquisitionState();
        this.userAnswer = []
        this.categories = [];
        this.questionHaveNewAnswerObserver = [];
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
        return 100; //TODO: Todo :p
    }

    getLastUserAnswerDate(): Date {
        if (this.hasUserAnswer()) {
            let indexLastUserAnswer = this.userAnswer.length - 1;
            return this.userAnswer[indexLastUserAnswer].date;
        }
        else {
            return new Date(1989, 5, 31);
        }
    }

    addQuestionHaveNewAnswerObserver(observer: Observer<Question>) {
        this.questionHaveNewAnswerObserver.push(observer);
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
        }
        return numberOfGoodAnswerInLastAnswers;
    }

    private addNewUserAnswer(isGoodAnswer: boolean) {
        const newUserAnswer = new UserAnswer(this.getCurrentDate(), isGoodAnswer);
        this.userAnswer.push(newUserAnswer);
        this.setAcquisitionState();
        this.notifiyObserver();
    }

    private notifiyObserver() {
        this.questionHaveNewAnswerObserver.forEach(observer => observer.next(this));
    }

    private getCurrentDate(): Date {
        const date = new Date();
        console.log(date);
        return new Date();
    }

    private hasUserAnswer(): boolean {
        return this.userAnswer.length !== 0;
    }
}
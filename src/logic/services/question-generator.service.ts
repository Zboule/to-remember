import { Injectable } from '@angular/core';

import { Observable, Observer, Subscriber } from 'rxjs';

import { Question } from '../entities/question';

import { QuestionsService } from '../services/questions.service';

@Injectable()
export class QuestionGeneratorService {

    private questions: Question[];
    private observersWaitingForAQuestion: Observer<Question>[];

    constructor(
        private questionsService: QuestionsService
    ) {
        this.initQuestions();
        this.initObserversWaitingForAQuestion();
    }

    getQuestion(): Observable<Question> {
        return this.createObservableQuestion();
    }

    setQuestionCategories(categories: string[]): void {
        this.questions = undefined;
        this.questionsService.getQuestionsByCategories(categories).subscribe(
            questions => this.setListOfQuestion(questions)
        )
    }

    private createObservableQuestion(): Observable<Question> {
        return new Observable<Question>((subscriber: Subscriber<Question>) => {
            if (!this.questions) {
                this.observersWaitingForAQuestion.push(subscriber);
            }
            else {
                this.sendNewQuestionToObserver(subscriber);
            }
        });
    }

    private sendNewQuestionToObserver(observer: Observer<Question>): void {
        /*
            ici viendra se placer toute la valeur ajoutée de l'application
            (elle sera au moins appelée ici)
            pour le moment c'est fait un plus simple
        */
        let nextQuestion = undefined;
        if (this.questions.length > 0) {
            nextQuestion = this.selectNextQuestion();
        }
        observer.next(nextQuestion);
    }

    private selectNextQuestion(): Question {
        console.log(this.questions);
        this.sortQuestionByRatio();
        return this.questions[0];
    }

    private sortQuestionByRatio() {
        this.questions.sort((questionA: Question, questionB: Question) => questionA.getAnswerRatio() - questionB.getAnswerRatio());
    }

    private setListOfQuestion(questions: Question[]): void {
        this.questions = questions
    }

    private initQuestions(): void {
        this.questionsService.getAllQuestions().subscribe(
            questions => this.setListOfQuestion(questions)
        );
    }

    private initObserversWaitingForAQuestion(): void {
        this.observersWaitingForAQuestion = [];
    }
}

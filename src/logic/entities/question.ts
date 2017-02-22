export class Question {

    categories: string[];
    question: string;
    answer: string;
    numberOfWrongAnswer: number;
    numberOfCorrectAnswer: number;

    constructor() {
        this.question = undefined;
        this.answer = undefined;
        this.numberOfCorrectAnswer = 0;
        this.numberOfWrongAnswer = 0;
        this.categories = [];
    }

    hasCategory(categoryName: string) {
        return undefined !== this.categories.find(
            value => value === categoryName
        )
    }

    addCorrectAnswer(): void {
        this.numberOfCorrectAnswer++;
    }

    addWrongAnswer(): void {
        this.numberOfWrongAnswer++;
    }

    getAnswerRatio(): number {
        if (this.numberOfWrongAnswer === 0)
            return this.numberOfCorrectAnswer;
        else
            return this.numberOfCorrectAnswer / this.numberOfWrongAnswer;
    }
}
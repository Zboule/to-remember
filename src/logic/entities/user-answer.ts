export class UserAnswer {

    date: Date;
    questionNumber: number;
    isGoodAnswer: boolean;

    constructor(questionNumber:number, isGoodAnswer:boolean) {
        this.date = new Date ();
        this.questionNumber = questionNumber;
        this.isGoodAnswer = isGoodAnswer;
    }
}
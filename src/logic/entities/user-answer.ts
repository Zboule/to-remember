
export class UserAnswer {

    date: Date;
    isGoodAnswer: boolean;

    constructor(date:Date, isGoodAnswer:boolean) {
        this.date = date;
        this.isGoodAnswer = isGoodAnswer;
    }
}
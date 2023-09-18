import { Field } from "./field.class";

export class Market{
    public cowsToBuy:number = 3;
    public strawsToBuy:number = 3;
    public employeesToHire:number = 3;
    public fieldsToBuy:Field[] = [];

    public currentWheatPrice:number = 20;
    public currentStrawPrice:number = 20;
    public currentCowPrice:number = 50;
    public currentMilkPrice:number = 3;
    public currentCheesePrice:number = 30;
}
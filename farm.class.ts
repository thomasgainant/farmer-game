import { Field } from "./field.class";

export class Farm{
    public money:number = 500;

    public fields:Field[] = [
        new Field(Field.Type.Grass, 2),
        new Field(Field.Type.Straw, 2)
    ];

    public employees:number = 1;

    public wheat:number = 0;
    public straw:number = 5;
    public cows:number = 1;
    public milk:number = 0;
    public cheese:number = 0;
}
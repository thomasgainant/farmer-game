export class Field{
    public type:Field.Type;
    public size:number;

    constructor(type:Field.Type, size:number){
        this.type = type;
        this.size = size;
    }
}

export namespace Field{
    export enum Type{
        Grass,
        Straw,
        Wheat
    }
}
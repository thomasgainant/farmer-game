export class Field{
    public type:Field.Type;
    public size:number;

    constructor(type:Field.Type, size:number){
        this.type = type;
        this.size = size;
    }

    getPrice(){
        return this.size * 100;
    }
}

export namespace Field{
    export enum Type{
        Grass,
        Straw,
        Wheat
    }
}
import { Field } from "./field.class";
import { Market } from "./market.class";
import { Player } from "./player.class";

export class Turn{
    public game:any;

    public players:Player[];
    public current:number = -1;

    public turnNumber:number = 0;
    public season:Turn.Season;
    public market:Market;

    public actionsForPlayers:number[];

    constructor(game:any, turnNumber:number, season:Turn.Season, market:Market){
        this.game = game;

        this.players = game.players;
        this.actionsForPlayers = [];
        for(let player of this.players){
            this.actionsForPlayers.push(player.farm.employees);
        }

        this.turnNumber = turnNumber;
        this.season = season;
        this.market = market;
    }

    public verifyPrices(){
        this.market.currentWheatPrice = Math.round(this.market.currentWheatPrice);
        if(this.market.currentWheatPrice <= 0)
            this.market.currentWheatPrice = 1;
        this.market.currentStrawPrice = Math.round(this.market.currentStrawPrice);
        if(this.market.currentStrawPrice <= 0)
            this.market.currentStrawPrice = 1;
        this.market.currentCowPrice = Math.round(this.market.currentCowPrice);
        if(this.market.currentCowPrice <= 0)
            this.market.currentCowPrice = 1;
        this.market.currentMilkPrice = Math.round(this.market.currentMilkPrice);
        if(this.market.currentMilkPrice <= 0)
            this.market.currentMilkPrice = 1;
        this.market.currentCheesePrice = Math.round(this.market.currentCheesePrice);
        if(this.market.currentCheesePrice <= 0)
            this.market.currentCheesePrice = 1;
    }

    next(){
        if(this.current == -1)
            console.log("TURN #"+this.turnNumber+" STARTS, season is "+Turn.Season[this.season].toString());

        this.current++;
        if(this.current >= this.players.length)
            this.end();
        else{
            console.log("Player "+this.current+" can play...");
            if(this.players[this.current].ai)
                this.players[this.current].aiThink(this);
        }

        this.game.ui.update();
    }

    end(){
        console.log("Turn ended.");

        this.market.cowsToBuy += -3 + Math.round(Math.random()*10);
        if(this.market.cowsToBuy < 0)
            this.market.cowsToBuy = 0;

        this.market.employeesToHire += -3 + Math.round(Math.random()*8);
        if(this.market.employeesToHire < 0)
            this.market.employeesToHire = 0;

        //Fields appears on the market
        let maxLuck = 10.0 - this.market.fieldsToBuy.length;
        let numberOfNewFields = Math.round(Math.random() * maxLuck);
        if(numberOfNewFields > 0){
            for(let f = 0; f < numberOfNewFields; f++){
                let newField = new Field(Math.floor(Math.random() * (typeof Field.Type).length), Math.round(Math.random() * 10.0));
                this.market.fieldsToBuy.push(newField);
            }
        }

        //market prices fluctuation
        this.market.currentWheatPrice = this.market.currentWheatPrice + (Math.random()*0.2*this.market.currentWheatPrice) - (Math.random()*0.2*this.market.currentWheatPrice);
        this.market.currentStrawPrice = this.market.currentStrawPrice + (Math.random()*0.2*this.market.currentStrawPrice) - (Math.random()*0.2*this.market.currentStrawPrice);
        this.market.currentCowPrice = this.market.currentCowPrice + (Math.random()*0.2*this.market.currentCowPrice) - (Math.random()*0.2*this.market.currentCowPrice);
        this.market.currentMilkPrice = this.market.currentMilkPrice + (Math.random()*0.2*this.market.currentMilkPrice) - (Math.random()*0.2*this.market.currentMilkPrice);
        this.market.currentCheesePrice = this.market.currentCheesePrice + (Math.random()*0.2*this.market.currentCheesePrice) - (Math.random()*0.2*this.market.currentCheesePrice);

        //Prices fluctuation, according to season
        switch(this.season){
            case Turn.Season.Winter:
            this.market.currentStrawPrice = this.market.currentStrawPrice - (this.market.currentStrawPrice*0.3);
            break;
            case Turn.Season.Spring:
            
            break;
            case Turn.Season.Summer:
            
            break;
            case Turn.Season.Autumn:
            this.market.currentStrawPrice = this.market.currentStrawPrice + (this.market.currentStrawPrice*0.3);
            break;
        }

       this.verifyPrices();
        
        this.players.map( (player, index) => {
            let totalPay = player.farm.employees * 50;
            player.farm.money = Math.round(player.farm.money - totalPay);
            console.log("Player "+index+" paid his employees "+totalPay+"€.");

            let amountOfFood = 0;
            if(this.season != Turn.Season.Winter){
                for(let field of player.farm.fields){
                    if(field.type == Field.Type.Grass)
                        amountOfFood += field.size;
                }
            }

            for(let i = 0; i < player.farm.cows; i++){
                if(amountOfFood > 0){
                    amountOfFood--;
                    player.farm.milk += 5;
                }
                else if(player.farm.straw > 0){
                    player.farm.straw--;
                    player.farm.milk += 5;
                }
                else {
                    console.log("Player "+index+" lost a cow to lack of food.");
                    player.farm.cows--;
                }
            }
        });

        let losingPlayers:any[] = this.players.map( (player, index) => { if(player.farm.money <= 0) return {player: player, index: index, money: player.farm.money}; return undefined; }).filter(item => item !== undefined);
        for(let losingPlayer of losingPlayers){
            console.log("Player "+losingPlayer.index+" filed for bankruptcy with "+losingPlayer.money+" in debt.");
            this.players.splice(this.players.indexOf(losingPlayer.player!), 1);
        }
        ((window as any).game as any).players = this.players;
        console.log(this.players);
        console.log(((window as any).game as any).players);

        if(this.players.length > 1){
            ((window as any).game as any)["turns"].push(new Turn(((window as any).game as any), this.turnNumber + 1, this.season < 3 ? this.season + 1 : 0, this.market));
            ((window as any).game as any)["turns"][((window as any).game as any)["turns"].length - 1].next();
        }
        else if(this.players.length == 1){
            console.log("Player XYZ won.");
        }
        else{
            console.log("Every players lost.");
        }
    }
}

export namespace Turn{
    export enum Season{
        Winter,
        Spring,
        Summer,
        Autumn
    }
}
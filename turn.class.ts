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

        //TODO market prices fluctuation, according to season
        
        this.players.map( (player, index) => {
            let totalPay = player.farm.employees * 50;
            player.farm.money -= totalPay;
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

        let losingPlayers:(Player | undefined)[] = this.players.map( (player) => { if(player.farm.money <= 0) return player; return undefined; }).filter(item => item !== undefined);
        for(let losingPlayer of losingPlayers){
            console.log("Player filed for bankruptcy.");
            this.players.splice(this.players.indexOf(losingPlayer!), 1);
        }
        ((window as any).game as any).players = this.players;

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
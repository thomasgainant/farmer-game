import { Market } from "./market.class";
import { Farm } from "./farm.class";
import { Field } from "./field.class";
import { Turn } from "./turn.class";

export class Player{
    public market:Market;
    public farm:Farm;
    public ai:boolean = false;

    constructor(market:Market, farm:Farm, ai:boolean = false){
        this.market = market;
        this.farm = farm;
        this.ai = ai;
    }

    getPlayerIndexForTurn(turn:Turn){
        return turn.players.indexOf(this);
    }

    aiThink(turn:Turn){
        setTimeout(() => {
            let actionType = 0;
            while(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
                actionType = Math.round(Math.random() * 11.0);
                console.log("Player "+this.getPlayerIndexForTurn(turn)+" is thinking..."+actionType);

                switch(actionType){
                    case 0:
                        this.plant(turn, this.farm.fields[Math.floor(Math.random()*this.farm.fields.length)], Math.floor(Math.random()*(typeof Field.Type).length));
                        break;
                    case 1:
                        this.buyCow(turn, Math.ceil(Math.random()*this.market.cowsToBuy));
                        break;
                    case 2:
                        this.buyStraw(turn, Math.ceil(Math.random()*this.market.strawsToBuy));
                        break;
                    case 3:
                        this.sellCow(turn, Math.ceil(Math.random()*this.farm.cows));
                        break;
                    case 4:
                        this.sellStraw(turn, Math.ceil(Math.random()*this.farm.straw));
                        break;
                    case 5:
                        this.sellWheat(turn, Math.ceil(Math.random()*this.farm.wheat));
                        break;
                    case 6:
                        this.sellMilk(turn, Math.ceil(Math.random()*this.farm.milk));
                        break;
                    case 7:
                        this.sellCheese(turn, Math.ceil(Math.random()*this.farm.cheese));
                        break;
                    case 8:
                        this.harvest(turn, this.farm.fields[Math.floor(Math.random()*this.farm.fields.length)]);
                        break;
                    case 9:
                        this.makeCheese(turn);
                        break;
                    case 10:
                        this.hire(turn, Math.ceil(Math.random()*this.market.employeesToHire));
                        break;
                    case 11:
                        this.buyField(turn, this.market.fieldsToBuy[Math.floor(Math.random()*this.market.fieldsToBuy.length)]);
                        break;
                }
            }
        }, 5000);
    }

    plant(turn:Turn, field:Field, type:Field.Type){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            console.log("Player plants "+Field.Type[type]+" in his field.");
            field.type = type;
            
            this.validateAction(turn);
            return true;
        }
        return false;
    }

    buyCow(turn:Turn, amount:number){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            if(this.market.cowsToBuy >= amount && this.farm.money >= amount * this.market.currentCowPrice){
                console.log("Player buys "+amount+" cow from the market.");
                this.farm.cows += amount;
                this.farm.money -= amount * this.market.currentCowPrice;
                this.market.cowsToBuy -= amount;
                
                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    buyStraw(turn:Turn, amount:number){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            if(this.market.strawsToBuy >= amount && this.farm.money >= amount * this.market.currentStrawPrice){
                console.log("Player buys "+(amount*100)+" kilos of straw from the market.");
                this.farm.straw += amount;
                this.farm.money -= amount * this.market.currentStrawPrice;
                this.market.strawsToBuy -= amount;
                
                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    buyField(turn:Turn, field:Field){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            let index = this.market.fieldsToBuy.indexOf(field);
            if(index > -1 && this.farm.money >= field.getPrice()){
                this.market.fieldsToBuy.splice(index, 1);
                this.farm.fields.push(field);
                this.farm.money = this.farm.money - field.getPrice();

                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    //influences market price when sells
    sellCow(turn:Turn, amount:number){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            if(amount <= this.farm.cows){
                console.log("Player sells "+amount+" cows.");
                this.farm.money += amount * this.market.currentCowPrice * 0.9;
                this.farm.cows -= amount;
                this.market.currentCowPrice -= amount * this.market.currentCowPrice * 0.1;
                turn.verifyPrices();
                
                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    //influences market price when sells
    sellStraw(turn:Turn, amount:number){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            if(amount <= this.farm.straw){
                console.log("Player sells "+(amount*100)+" kilos of straw.");
                this.farm.money += amount * this.market.currentStrawPrice;
                this.farm.straw -= amount;
                this.market.currentStrawPrice -= amount * this.market.currentStrawPrice * 0.1;
                turn.verifyPrices();
                
                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    //influences market price when sells
    sellWheat(turn:Turn, amount:number){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            if(amount <= this.farm.wheat){
                console.log("Player sells "+(amount*100)+" kilos of wheat.");
                this.farm.money += amount * this.market.currentWheatPrice;
                this.farm.wheat -= amount;
                this.market.currentWheatPrice -= amount * this.market.currentWheatPrice * 0.1;
                turn.verifyPrices();
                
                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    //influences market price when sells
    sellMilk(turn:Turn, amount:number){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            if(amount <= this.farm.milk){
                console.log("Player sells "+(amount*10)+" litres of milk.");
                this.farm.money = this.farm.money + (amount * 10 * this.market.currentMilkPrice);
                this.farm.milk = this.farm.milk - amount;
                this.market.currentMilkPrice -= amount * this.market.currentMilkPrice * 0.1;
                turn.verifyPrices();
                
                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    //influences market price when sells
    sellCheese(turn:Turn, amount:number){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            if(amount <= this.farm.cheese){
                console.log("Player sells "+amount+" cheeses.");
                this.farm.money += amount * this.market.currentCheesePrice;
                this.farm.cheese -= amount;
                this.market.currentCheesePrice -= amount * this.market.currentCheesePrice * 0.1;
                turn.verifyPrices();
                
                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    harvest(turn:Turn, field:Field){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            console.log("Player harvests his "+Field.Type[field.type]+" field.");
            if(field.type == Field.Type.Wheat)
                this.farm.wheat += field.size;
            else if(field.type == Field.Type.Straw)
                this.farm.straw += field.size;
            else
                return false;
            this.validateAction(turn);
            return true;
        }
        return false;
    }

    makeCheese(turn:Turn){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            //TODO
            return false;
        }
        return false;
    }

    hire(turn:Turn, amount:number){
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] > 0){
            if(this.market.employeesToHire > 0 && this.market.employeesToHire >= amount){
                console.log("Player hires "+amount+" employees");
                this.farm.employees++;
                this.market.employeesToHire--;
                
                this.validateAction(turn);
                return true;
            }
            return false;
        }
        return false;
    }

    private validateAction(turn:Turn){
        ((window as any).game as any).ui.update();

        turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)]--;
        if(turn.actionsForPlayers[this.getPlayerIndexForTurn(turn)] == 0)
            turn.next();
    }
}
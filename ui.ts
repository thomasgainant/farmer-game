import { Field } from "./field.class";
import { Market } from "./market.class";
import { Player } from "./player.class";
import { Turn } from "./turn.class";

export class UI{
    public avatar:Player;
    public market:Market;
    public turns:Turn[] = [];

    constructor(avatar:Player, market:Market){
        this.avatar = avatar;
        this.market = market;

        setTimeout(()=>{
            this.initialize();
        }, 100);

        /*setInterval(()=>{
        //setTimeout(()=>{
            this.update();
        }, 500);*/
    }

    getCurrentTurn(){
        return this.turns[this.turns.length - 1];
    }

    initialize(){
        document.querySelector("#market #items #items_commands #employees button")?.addEventListener("click", (e:Event) => {
            e.preventDefault();
            let amount = parseInt((document.querySelector("#market #items #items_commands #employees input") as any).value);
            this.avatar.hire(this.getCurrentTurn(), amount);
        });
        document.querySelector("#market #items #items_commands #cows button")?.addEventListener("click", (e:Event) => {
            e.preventDefault();
            let amount = parseInt((document.querySelector("#market #items #items_commands #cows input") as any).value);
            this.avatar.buyCow(this.getCurrentTurn(), amount);
        });
        document.querySelector("#market #items #items_commands #straw button")?.addEventListener("click", (e:Event) => {
            e.preventDefault();
            let amount = parseInt((document.querySelector("#market #items #items_commands #straw input") as any).value);
            this.avatar.buyStraw(this.getCurrentTurn(), amount);
        });

        document.querySelector("#market #prices #sell_commands #wheat button")?.addEventListener("click", (e:Event) => {
            e.preventDefault();
            let amount = parseInt((document.querySelector("#market #prices #sell_commands #wheat input") as any).value)/100;
            this.avatar.sellWheat(this.getCurrentTurn(), amount);
        });
        document.querySelector("#market #prices #sell_commands #straw button")?.addEventListener("click", (e:Event) => {
            e.preventDefault();
            let amount = parseInt((document.querySelector("#market #prices #sell_commands #straw input") as any).value)/100;
            this.avatar.sellStraw(this.getCurrentTurn(), amount);
        });
        document.querySelector("#market #prices #sell_commands #cows button")?.addEventListener("click", (e:Event) => {
            e.preventDefault();
            let amount = parseInt((document.querySelector("#market #prices #sell_commands #cows input") as any).value);
            this.avatar.sellCow(this.getCurrentTurn(), amount);
        });
        document.querySelector("#market #prices #sell_commands #milk button")?.addEventListener("click", (e:Event) => {
            e.preventDefault();
            let amount = parseInt((document.querySelector("#market #prices #sell_commands #milk input") as any).value)/10;
            this.avatar.sellMilk(this.getCurrentTurn(), amount);
        });
        document.querySelector("#market #prices #sell_commands #cheese button")?.addEventListener("click", (e:Event) => {
            e.preventDefault();
            let amount = parseInt((document.querySelector("#market #prices #sell_commands #cheese input") as any).value);
            this.avatar.sellCheese(this.getCurrentTurn(), amount);
        });
    }

    update(){
        document.querySelector("#game #turnNumber")!.innerHTML = "Turn #"+this.getCurrentTurn().turnNumber;
        let season = "";
        switch(this.getCurrentTurn().season){
            case Turn.Season.Winter:
                season = "Winter";
                break;
            case Turn.Season.Spring:
                season = "Spring";
                break;
            case Turn.Season.Summer:
                season = "Summer";
                break;
            case Turn.Season.Autumn:
                season = "Autumn";
                break;
        }
        document.querySelector("#game #season")!.innerHTML = season;

        this.updateMarket();

        for(let i = 0; i < this.getCurrentTurn().players.length; i++){
            let player = this.getCurrentTurn().players[i];
            this.updatePlayer(this.getCurrentTurn(), player);
        }
    }

    private updateMarket(){
        document.querySelector("#market #items #employees")!.innerHTML = this.market.employeesToHire+"";
        document.querySelector("#market #items #cows")!.innerHTML = this.market.cowsToBuy+"";
        document.querySelector("#market #items #straw")!.innerHTML = (this.market.strawsToBuy*100)+" kilos";

        document.querySelector("#market #prices #wheat")!.innerHTML = (this.market.currentWheatPrice)+"€ / 100 kilos";
        document.querySelector("#market #prices #straw")!.innerHTML = (this.market.currentStrawPrice)+"€ / 100 kilos";
        document.querySelector("#market #prices #cows")!.innerHTML = (this.market.currentCowPrice)+"€ / cow";
        document.querySelector("#market #prices #milk")!.innerHTML = (this.market.currentMilkPrice)+"€ / 10 litre";
        document.querySelector("#market #prices #cheese")!.innerHTML = (this.market.currentCheesePrice)+"€ / cheese";

        let currentPlayer = this.getCurrentTurn().players[this.getCurrentTurn().current];
        if(currentPlayer != this.avatar){
            document.querySelector("#market #items #items_commands")?.setAttribute("style", "display: none;");
            document.querySelector("#market #prices #sell_commands")?.setAttribute("style", "display: none;");
        }
        else{
            document.querySelector("#market #items #items_commands")?.removeAttribute("style");
            document.querySelector("#market #prices #sell_commands")?.removeAttribute("style");
        }
    }

    private updatePlayer(turn:Turn, player:Player){
        let i = player.getPlayerIndexForTurn(turn);

        document.querySelector("#player"+i+" .turnIndicator")?.remove();
        if(turn.current == i){
            let turnIndicator = document.createElement("div");
            turnIndicator.setAttribute("class", "turnIndicator");
            turnIndicator.innerHTML = "Playing, "+turn.actionsForPlayers[player.getPlayerIndexForTurn(turn)]+" actions left";
            document.querySelector("#player"+i)?.insertBefore(turnIndicator, document.querySelector("#player"+i)!.firstChild);
        }

        document.querySelector("#player"+i+" #money")!.innerHTML = player.farm.money+"€";
        document.querySelector("#player"+i+" #employees")!.innerHTML = player.farm.employees+"";

        document.querySelector("#player"+i+" #wheat")!.innerHTML = (player.farm.wheat*100)+" kilos";
        document.querySelector("#player"+i+" #straw")!.innerHTML = (player.farm.straw*100)+" kilos";
        document.querySelector("#player"+i+" #cows")!.innerHTML = player.farm.cows+"";
        document.querySelector("#player"+i+" #milk")!.innerHTML = (player.farm.milk*10)+" litres";;
        document.querySelector("#player"+i+" #cheese")!.innerHTML = player.farm.cheese+"";

        let original = document.querySelector("#template_fields");
        original?.setAttribute("style", "display:none");

        document.querySelector("#player"+i+" .fields")?.remove();
        let fieldsNode = original?.cloneNode(true);
        document.querySelector("#player"+i)?.appendChild(fieldsNode!);
        let fieldsElement = document.querySelector("#player"+i+" .fields");
        fieldsElement?.removeAttribute("id");
        fieldsElement?.setAttribute("style", "");

        let template_fieldElement = document.querySelector("#player"+i+" .fields .field");

        for(let j = 0; j < player.farm.fields.length; j++){
            let fieldNode = template_fieldElement?.cloneNode(true);
            template_fieldElement?.parentElement!.appendChild(fieldNode!);
            
            let field = player.farm.fields[j];
            let fieldElements = document.querySelectorAll("#player"+i+" .fields .field");
            let fieldElement = fieldElements[fieldElements.length - 1];

            if(field.type == Field.Type.Wheat){
                let content = "";
                for(let k = 0; k < field.size; k++){
                    content += "\\|/";
                }
                fieldElement!.querySelector(".content")!.innerHTML = content;
            }
            else if (field.type == Field.Type.Straw){
                let content = "";
                for(let k = 0; k < field.size; k++){
                    content += "|";
                }
                fieldElement!.querySelector(".content")!.innerHTML = content;
            }
            else{
                let content = "";
                for(let k = 0; k < field.size; k++){
                    content += "w";
                }
                fieldElement!.querySelector(".content")!.innerHTML = content;
            }

            if(player.ai)
                fieldElement.querySelector(".commands")?.setAttribute("style", "display: none;");
            else{
                fieldElement.querySelector(".commands .harvest")?.addEventListener("click", (e:Event) => {
                    e.preventDefault();
                    this.avatar.harvest(turn, field);
                });
            }
        }

        template_fieldElement?.setAttribute("style", "display: none;");
    }
}
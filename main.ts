import { Farm } from "./farm.class";
import { Market } from "./market.class";
import { Player } from "./player.class";
import { Turn } from "./turn.class";
import { UI } from "./ui";

((window as any).game as any) = {};

((window as any).game as any).market = new Market();

((window as any).game as any).players = [
    new Player(((window as any).game as any).market, new Farm(), true),
    new Player(((window as any).game as any).market, new Farm(), true),
    new Player(((window as any).game as any).market, new Farm()),
    new Player(((window as any).game as any).market, new Farm(), true)
] as Player[];

((window as any).game as any).ui = new UI(((window as any).game as any).players[2], ((window as any).game as any).market);

((window as any).game as any).turns = [
    new Turn(((window as any).game as any), 1, Turn.Season.Spring, ((window as any).game as any).market)
] as Turn[];

((window as any).game as any).ui.turns = ((window as any).game as any).turns;

setTimeout(()=>{
    ((window as any).game as any).turns[0].next();
}, 100);
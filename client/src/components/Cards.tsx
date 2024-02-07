import { useState } from "react";
import { GameState, Card } from "../types";

function SingleCard({card, index}: {card:Card, index:number}){
    return(
        <div className="flex flex-col items-center justify-center rounded-lg bg-white text-black p-2 w-full outline outline-slate-900 outline-0 hover:outline-4">
            <h1>{card.value}</h1>
            <h1>{card.element}</h1>
            <p className="text-sm ">{index}</p>
        </div>
    )
}

function Cards({state, playerId} : {state:GameState, playerId:string}){
    const [player] = useState(state.players.find(p=>p.id===playerId));
    return(
        <div className="flex flex-row gap-2 max-w-full">
            {player && state.cards[player.index].map((card, index)=><SingleCard card={card} index={index} key={index}/>)}
        </div>
    );
}
export default Cards
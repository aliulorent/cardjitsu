import { useContext, useEffect, useState, useRef } from "react";
import { MessageContext } from "../views/Room";
import { Card } from "../types";
import SingleCard from "./SingleCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function RoundFinishedDisplay(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));
    const [didWin] = useState(socketData?.state?.roundWinner===socketData?.playerId ? true : false);
    const yourCard = useRef(null);
    const opponentCard = useRef(null);
    const result = useRef(null);
    
    useGSAP(()=>{
        gsap.timeline({defaults:{opacity:100}})
        .set(".hidingLayer", {opacity:100})
        .from(yourCard.current, {left:"50%", xPercent:-50, duration: 0.5, delay: 0.5})
        .from(opponentCard.current, {opacity:0, scale: 0, delay:0.5, ease: "back.out" })
        .to(opponentCard.current, {width:"0px", scale:1.1, delay:1, duration:0.1})
        .set(".hidingLayer", {opacity:0})
        .to(opponentCard.current, {width:"115px", scale:1, delay:0, duration:0.1})
        .from(result.current, {scale:0, opacity:0, delay:0.5, ease:"back.out"})
    })

    return(
        <div className="text-text font-lilita text-2xl text-center w-full flex flex-1 flex-col gap-2 justify-end items-center">
            <h1 ref={result} className="text-5xl m-5">{didWin ? "Round Won!" : "Round Lost!"}</h1>
            <div className="result-display flex flex-row gap-8 mb-20">
                {player && socketData && <SingleCard ref={yourCard} card={socketData?.state?.cards[player.index][socketData.state.selected[player.index] || 0] as Card} index={socketData.state?.selected[player.index]|| 0 } selected={true}/>}
                {player && socketData && <SingleCard attrs="hidingLayer" ref={opponentCard} card={socketData?.state?.cards[player.index == 1 ? 0 : 1][socketData.state.selected[player.index == 1 ? 0 : 1] || 0] as Card} index={socketData.state?.selected[player.index == 1 ? 0 : 1]|| 0 } selected={true}/>}
            </div>
        </div>
    )
}

function PlayStartDisplay(){
    const socketData = useContext(MessageContext);
    const [player] = useState(socketData?.state?.players.find(p=>p.id===socketData.playerId));
    const [time, setTime] = useState((socketData?.state?.time as number)/1000);
    useEffect(() => {
        const timer = setInterval(()=>{
            if(time && time > 0){
                setTime((prev)=>prev-1);
            }
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);
    return(
        <div className="text-text font-lilita text-2xl text-center w-full flex flex-1 flex-col gap-2 justify-between items-center">
            <div className="flex flex-col items-center mt-15">
                <h3>Time Left:</h3>
                <h3>{time}</h3>
            </div>
            <div className="flex flex-col items-center justify-end gap-2 mb-20 text-secondary">
                <h3>Selected:</h3>
                {player && socketData && <SingleCard card={socketData?.state?.cards[player.index][socketData.selectIndex] as Card} index={socketData.selectIndex} selected={true}/>}
            </div>
        </div>
    )
}
function GameStartDisplay(){
    return(
        <div className="text-text font-lilita text-2xl text-center w-full">
            <h1>Game Started!</h1>
        </div>
    )
}

function StatusDisplay(){
    // 0 - Game Start, 1 - Round play, 2 - Round finished, 3 - Game Finished
    const [status, setStatus] = useState(-1);
    const socketData = useContext(MessageContext);
    useEffect(()=>{
        if(socketData && socketData.state){
            if(socketData.state.phase==="START"){
                setStatus(0);
            }
            if(socketData.state.phase==="PLAY"){
                setStatus(1);
            }
            if(socketData.state.phase==="RESULT"){
                setStatus(2);
                socketData.setSelectIndex(-1);
            }
            if(socketData.state.phase==="END"){
                setStatus(3);
            }
        }
    }, [socketData?.state])
    return(
        <>
            {status===0 && <GameStartDisplay/>}
            {status===1 && <PlayStartDisplay/>}
            {status===2 && <RoundFinishedDisplay/>}
            {status===3 && <RoundFinishedDisplay/>}
        </>
    )
}
export default StatusDisplay
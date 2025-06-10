import React, { useState } from "react"
import { Button } from "react-bootstrap"


export default function StartMessage(props){
    const [showText, setShowText] = useState(false)
    const [currentSelection,setCS] = useState(undefined)
    const sigmaPerks = ["x1.25 multiplier on BlackJack", "x1.3 when playing solo", "x1.5 mulitplier on side bets"]
    const rizzPerks = ["x1.3 multiplier when playing with one other person", "x1.25 multplier on Baccarat", "x1.1 multplier on 1:2 bets on Roullette"]
    const auraPerks = ["x1.75 multiplier when winning an 'all in' bet", "x4 multiplier when winning a solo side bets", "x2.5 multiplier when winning a bet on a single number on Roullette"]
    const skibidiPerks = ["x1.25 multiplier on Roullette", "No commission on Baccuarat, Banker bets also wins 1.1x as much as player", "x2 multiplier on dealer bust side bets on BlackJack"]
    const goonPerks = ["x1.5 multipler when playing with at least 4 other Gooners", "x1.25 multiplier when betting more than 75% of your money", "x1.2 multiplier for player bets on Baccarat"]


    function PlayerGuild(name){
        props.setPlayerGuild(name)
        props.setNickName(document.getElementById("NameInput").value)
    }
    

    function intoSessionStorage(team){
        PlayerGuild(team)
        sessionStorage.setItem("BrainrotCasino", {name:props.name,money:1000,PlayerId:props.PlayerId, team:team})
    }
    return (<div>
        <h1>Enter your name</h1>
        <input type="text" id="NameInput" placeholder="Enter name here" onChange={(e) => {
            props.setNickName(e.target.value)
        }}>
        </input>
        {props.Name != "" ? <div>
        {/* <h2>Pick a guild!</h2> */}
        <div style={{display:"block", alignContent:"space-around"}}>
            <Button variant="success" style={{marginLeft:"15px", width:"155px"}} onMouseOver={() =>{}} onClick={() => {intoSessionStorage("Sigma Nation")}}>Proceed</Button>
            
            {/* <Button variant="success" style={{marginLeft:"15px", width:"155px"}} onMouseOver={() =>{setCS(sigmaPerks)}} onClick={() => {intoSessionStorage("Sigma Nation")}}>Sigma Nation</Button>
            <Button variant="danger" style={{marginLeft:"15px", width:"155px"}} onMouseOver={() =>{setCS(rizzPerks)}} onClick={() => {intoSessionStorage("Rizzlers United")}}>Rizzlers United</Button>
            <Button variant="primary" style={{marginLeft:"15px", width:"155px"}} onMouseOver={() =>{setCS(auraPerks)}} onClick={() => {intoSessionStorage("Aura Alliance")}}>Aura Alliance</Button>
            <Button variant="warning" style={{marginLeft:"15px", width:"155px"}} onMouseOver={() =>{setCS(skibidiPerks)}} onClick={() => {intoSessionStorage("Skibidi Society")}}>Skibidi Society</Button>
            <Button variant="light" style={{marginLeft:"15px", width:"155px"}} onMouseOver={() =>{setCS(goonPerks)}} onClick={() => {intoSessionStorage("Gooner Gang")}}>Gooner Gang</Button>
             */}
            {currentSelection ? 
            <ol>
                {currentSelection.map((item)=>{
                    return <li>
                        <h4>{item}</h4>
                    </li>
                })}
            </ol>
            :
            <h2>
                Welcome!
            </h2>
            }
        </div>
    </div>: <p>hi</p>}

    </div>)
}
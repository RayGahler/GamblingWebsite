import React, {useState,useEffect} from "react";
import {Button} from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';
import './MyHandBlackJack.css'
import PlayingCard from "./PlayingCard";

function MyHandBlackJack(props){
    const [intendedMove, setIntendedMove] = useState("None")
    const [timer, setTimer] = useState(15)
    var ws = props.ws

    useEffect(() => {
        ws.on("Timer", (t) => {

            if(t <= 0){
                console.log("Timer expired");
                ws.emit("CheckTime")
            }
            console.log("Timer: " + t);

            setTimer(t)
            
        })
        return () => {
            ws.off("Timer", (t) => {
                setTimer(t)
            })
        }
    },[])
    

    
    



    function intend(move){
        ws.emit("Intend", {"PlayerId" : props.playerId, "IntendedMove" : move})
    } 

    function execute(move=""){
        ws.emit("Execute", {"PlayerId" : props.playerId, "Intended" : move})
    }

    if(props.myTurn && intendedMove !== "None"){
        execute(intendedMove)
    }

    function intendMove(move){
        if(move === intendedMove){
            return
        }
        console.log(intendedMove)
        if(props.myTurn){
            execute(move)
            setIntendedMove("None")
        }
        else{
            intend(move)
            setIntendedMove(move)
        }
    }
   

    var idx = -1

    return(
        <div>
            <div id="Activator"></div>
            <div className="Cards">
                {props.Cards.map((card) => {
                    idx += 1
                    return <PlayingCard cardNumb={card} cardSuit={props.Suits[idx]}></PlayingCard>
                })}
            </div>
            {props.myTurn ? 
                <div id="timer"><h3>{timer}</h3></div>
            :
                <div id="intended"> <h3>{intendedMove}</h3></div>
            }
            <div className="ButtonContainer">
                <Button className="PlayerButton" variant="success" onClick={() => {
                    intendMove("Hit")
                }}>Hit</Button>
                <Button className="PlayerButton" variant="danger" onClick={() => {
                    intendMove("Fold")
                }}>Stand</Button>
               
                <Button className="PlayerButton" variant="warning" onClick={() => {
                    intendMove("Double")
                }}>Double</Button>
                <Button className="PlayerButton" variant="dark" disabled= {!props.Splittable} onClick={() => {
                    intendMove("Split")
                }}>Split</Button>
                
            </div>
          
        </div>
    )

}

export default MyHandBlackJack
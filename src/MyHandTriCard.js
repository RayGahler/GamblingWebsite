import React, {useState,useEffect} from "react";
import {Button} from "react-bootstrap";
//import PlayingCard from "./PlayingCard";
// import { Button } from "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyHandTriCard.css'
import PlayingCard from "./PlayingCard";


function MyHandTriCard(props){
    const [intendedMove, setIntendedMove] = useState("")
    const [timer, setTimer] = useState(15)
    var ws = props.ws

    function Timer(){
        var thing = timer
        useEffect(() => {
            ws.on("Timer", (t) => {

                setTimer(t)
                thing = t
                if (t == 0){
                    ws.emit("CheckTime")
                }
            })
            return () => {
                ws.off("Timer", (t) => {
                    setTimer(t)
                    if (t == 0){
                        ws.emit("CheckTime")
                    }
                })
            }
        },[])
        

       
        return (<h3>{thing}</h3>)
    }


    function intend(){
        setTimer(30)
        ws.emit("Intend", {"PlayerId" : props.playerId, "IntendedMove" : intendedMove})
    } 

    function execute(){
        setIntendedMove("")
        ws.emit("Execute", {"PlayerId" : props.playerId})
    }

    if(intendedMove){
        intend()
        if(props.myTurn){
            execute()
        }
        setIntendedMove("")
    }
   

    var idx = -1

    return(
        <div>
            {props.Cards.map((card) => {
                idx += 1
                return <PlayingCard cardNumb={card} cardSuit={props.Suits[idx]}></PlayingCard>

            })}
            <br></br>
            
            <br></br>
            <div className="ButtonContainer">
                <Button className="PlayerButton" variant="success" onClick={() => {
                    setIntendedMove("Play")
                }}>Play</Button>
                <Button className="PlayerButton" variant="danger" onClick={() => {
                    setIntendedMove("Fold")
                }}>Fold</Button>
               
                
            </div>
            <br></br>
            <h1>My hand</h1>

            {props.myTurn ? props.currentHand ? <Timer></Timer>: <p>Not this hand</p> : <p>Not your turn</p>}
        </div>
    )

}

export default MyHandTriCard
import React, { useRef, useState} from "react";
import {Dealer,Player} from "./BlackJackBoard"
import MyHand from "./MyHandBlackJack";
import Room from "./Room"
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


function BlackJack(props){
    const [dealerTurn, setDealerTurn] = useState(false)
    const [dealerBust,setDealerBust] = useState(false)
    const [currentLookingPlayer, setCurrentLookingPlayer] = useState([])
    const currentLookingHand = useRef(0)

    var ws = props.ws
    var dealer
    var players
    var myHands
    var myCurrentHand
    var myIndex
    var Me


    if (props.GameData){
        dealer = props.GameData.Dealer
        players = props.GameData.Players //Will be an array
        for(var i = 0; i < players.length; i++){
            if (props.Me.PlayerId === players[i].PlayerId){
                myIndex = i
                Me = players[i]
                currentLookingHand.current = i
                break
            }
        }

        
        myHands = props.Me.PlayerHands
        myCurrentHand = myHands[props.Me.handTurn]

        if(dealer.Turn && !dealerTurn){
            setDealerTurn(true)
            dealer.Turn = false        
        }
       
    }


  

    function Board(){
        
        return(<div> 
        <Dealer Cards={dealer.Hand.currentHand} Total={dealer.Hand.Total} Suits={dealer.Hand.currentHandSuits}></Dealer>


            <div>

                {currentLookingHand.current === myIndex ? 
                    <MyHand Cards={myCurrentHand.currentHand} Me={props.Me} Splittable={myCurrentHand.canSplit} Total={myCurrentHand.Total} ws={ws} playerId={props.Me.PlayerId} myTurn={props.Me.Turn} currentHand={true} Suits= {myCurrentHand.currentHandSuits}></MyHand>
                    :
                    <Player Cards={players[currentLookingHand.current].Hands[0]} Total={players[currentLookingHand.current].Hands[0].Total} Suits={players[currentLookingHand.current].Hands[0].currentHandSuits}></Player>
                }

            </div>


        
        </div>
        )
    }

    function CheckDealer(){
        if(dealer.Lost){
            setDealerBust(true)
            return false
        }
        else{
            
            return true
        }
    }

    
    function CheckWin(player){
        if (dealerBust && !player.Lost){
            return ["#00ff00",<h2>You win</h2>]
        }
        else if(player.Lost){
            return ["#ff0000",<h2>You lost</h2>]
        }
        else if(player.Total > dealer.Hand.Total){
            return ["#00ff00",<h2>You win</h2>]
        }
        else if(player.Total === dealer.Hand.Total){
            return ["#ff8800",<h2>You got pushed</h2>]
        }
        else{
            return ["#ff0000",<h2>You lose</h2>]
        }
    }

    function goBack(){
        setDealerTurn(false)
        setDealerBust(false)
        setCurrentLookingPlayer([])
        props.GamedataHandle(false)
    }

    function FinalBoard(){
        
        if(currentLookingPlayer.length == 0){
            setCurrentLookingPlayer(myHands)
        }
        return(<div> 
        <Button onClick={goBack}>Go Back</Button>
        <br></br>
        <div style={{backgroundColor : props.Me.Lost > 0 ? "#00ff00" : "#ff0000"}}>
            <Dealer Cards={dealer.Hand.currentHand} Total={dealer.Hand.Total} Suits={dealer.Hand.currentHandSuits} Color={CheckDealer() ? "#00ff00" : "#ff0000"}></Dealer>
            
        </div>


        <div style={{position : "absolute", justifyContent: "space-evenly", alignItems: "left", display: "flex", flexDirection: "column", flexWrap: "wrap"}}>
        {
            players.map((player) => {
                return(
                   
                        <div style={{height: "100px",width: "100px",display: "flex",  flexDirection: "column", left: "0%", top : "0%", backgroundColor : player.Lost > 0 ? "#cc0000" : "#00cc00", border : "2px solid black", justifyContent: "center", alignItems: "center"}}
                         onClick={() => {setCurrentLookingPlayer(player.PlayerHands)}}>
                            <p style={{color : "#000000"}}>{player.Name}</p>
                            <p style={{color : "#000000"}}>${-player.Lost}</p>
                        </div>
                    
                )
            })
        }
        </div>
    

        {
            currentLookingPlayer.map((hand) => {
                var stats = CheckWin(hand)
                
                return (
                    <div style={{backgroundColor :  (stats[0])}}>
                    {<Player Cards={hand.currentHand} Total={hand.Total} Suits={hand.currentHandSuits}></Player>}
                    {stats[1]}
                    </div>
                )
            })
        }

        {/* {players.map((player)=>{
            var text = (<p>not you</p>)
            return player.PlayerHands.map((Hands) => {
                var stats = CheckWin(Hands)
                return (
                    <div style={{backgroundColor : stats[0]}}>

                        <Player Cards={Hands.currentHand} Total={Hands.Total} Suits={Hands.currentHandSuits}></Player>
                        {text}
                    </div>
                )
            })
        })} */}
    
        </div>
    )
    }
    
    return (
        <div>
            
            <br></br>

            {
                dealerTurn ? <FinalBoard></FinalBoard> :
                
                props.GameData ?  
                <Board></Board>
                :<div> 
                <Room ws={ws} players={props.lobbyData} playerId= {props.Me.PlayerId} me={props.Me} GameId= {props.GameId} inGameHandle = {props.inGameHandle} gameCodeHandle = {props.gameCodeHandle}></Room>
                <h1> Your game Id is {props.GameId}</h1>
                </div>}
        </div>
    )
}

export default BlackJack
import React, { useState } from "react"
import Room from "./Room"
import MyHand from "./MyHandTriCard"
import { Player,Dealer } from "./TriCardBoard"


function TriCard(props) {
    const [dealerTurn, setDealerTurn] = useState(false)
    const [dealerBust, setDealerBust] = useState(false)

    var ws = props.ws
    var dealer
    var players
    var myHands
    var myCurrentHand



    if (props.GameData) {
        dealer = props.GameData.Dealer
        players = props.GameData.Players //Will be an array
        (dealer)
        players = players.filter((player) => {
            return props.Me.PlayerId !== player.PlayerId
        })
        (props.Me)
        myHands = props.Me.PlayerHands
        myCurrentHand = myHands[props.Me.handTurn]

        if (dealer.Turn && !dealerTurn) {
            setDealerTurn(true)
            dealer.Turn = false
        }

    }

    function Board() {
       return (<div>
        <Dealer Cards={dealer.currentHand} Total={dealer.Total} Suits={dealer.currentHandSuits}></Dealer>
        
        
         <div style={{ backgroundColor: props.Me.Turn ? "#0055ff" : "#00ffff" }}>
            <MyHand Cards={myCurrentHand.currentHand} Me={props.Me} Splittable={myCurrentHand.canSplit} Total={myCurrentHand.Total} ws={ws} playerId={props.Me.PlayerId} myTurn={props.Me.Turn} currentHand={true} Suits={myCurrentHand.currentHandSuits}></MyHand>
        </div>
        {
            myHands.map((hand) => {
                if (hand !== myCurrentHand) {
                    return (
                        <div>
                            {<MyHand Cards={hand.currentHand} Splittable={hand.canSplit} Total={hand.Total} ws={ws} playerId={props.Me.PlayerId} myTurn={props.Me.Turn} currentHand={false} Suits={hand.currentHandSuits}></MyHand>}
                        </div>
                    )
                }
                return (<br></br>)
            })
        }
        {
            players.map((player) => {
                return player.PlayerHands.map((Hands) => {
                    return (
                        <div style={{ backgroundColor: (player.Turn ? "#ffff00" : "000000") }}>
                            <Player Cards={Hands.currentHand} Total={Hands.Total} Suits={Hands.currentHandSuits}></Player>
                        </div>
                    )
                }

                )
            })
        }
        </div>)
    }

    return (
        <div>
            <h1> Your game Id is {props.GameId}</h1>

            <br></br>

            {

                props.GameData ?
                    <Board></Board>
                    : <Room ws={ws} players={props.lobbyData} playerId={props.Me.PlayerId} me={props.Me} GameId={props.GameId} inGameHandle={props.inGameHandle} gameCodeHandle={props.gameCodeHandle}></Room>}

        </div>
    )
    
}


export default TriCard
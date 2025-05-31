import React, {useState} from "react"

function RoomSettings(props){
    const [roomMax, setRoomMax] = useState(5)
    
    var ws = props.ws


    function createGame(){
        if(props.name){
            ws.emit("GiveName", [props.name,props.PlayerId])
            ws.emit("CreateGame", {"roomMax" : roomMax, "GameMode" : props.GameMode})
        }
        else{
            alert("Put in a name")
        }
    }


    return(
        <div style={{border : "dashed"}}>
            <input type="range" min="1" max = "8" defaultValue="5" onChange={(e) => {
                setRoomMax(e.target.value)
            }}></input>
            
            <p>{roomMax}</p>
            
            <select value={props.GameMode} onChange={(e) => {props.setGameMode(e.target.value)}}>
                <option value="Blackjack">Blackjack</option>
            </select>
            <br></br>
            <br></br>
            <button onClick={createGame}>Create {props.GameMode} Game</button>

           </div>
    )
}

export default RoomSettings
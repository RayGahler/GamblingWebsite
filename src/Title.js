import React, {useState} from "react";
import RoomSettings from "./CreateRoomSettings";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import './Title.css'


function TitleScreen(props){
    var ws = props.ws
    const [message, setMessage] = useState("")
    const [creatingRoom, setCreatingRoom] = useState(false)


    function joinGame(){
        
        ws.emit("GiveName", [props.name, props.PlayerId])
        ws.emit("JoinGame", message)   
    
    }   

   

    function setRoom(){
        setCreatingRoom(true)
    }
    return (

        <div>
            <h3>{props.name}, <br></br>Welcome to the casino {/*props.Guild*/}</h3>


            
            <div id = "divItemGroup">

                <input type = "text" style={{marginRight : "30px"}} placeholder="Enter GameCode" onChange={(e) => {
                    setMessage(e.target.value)
                }}></input>
                <Button onClick={joinGame}>Join</Button>


                <br></br>
                <Button onClick={setRoom}>Create Game</Button>
            </div>
               
            {creatingRoom ? <RoomSettings ws={ws} name={props.name} PlayerId={props.PlayerId} GameMode={props.GameMode} setGameMode={props.setGameMode}></RoomSettings> : <br></br> }
        </div>

    )
}
export default TitleScreen
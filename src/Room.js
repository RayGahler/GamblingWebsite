import { Button, Card, Form } from "react-bootstrap"
import './bootstrap.min.css';


function Room(props){
    var ws = props.ws
    var players = props.players
    var bet = 1

    function startGame(){
        ws.emit("StartGame",[props.playerId,props.GameId,bet])
    }

    function leaveGame(){
        props.inGameHandle(false)
        props.gameCodeHandle(0)
        ws.emit("Leave", [props.playerId,props.GameId])
    }

    function setBet(e){
        bet = e.target.value
        document.getElementById("betText").value = bet
    }

    function PlayerCard(player){

        return (<Card bg={player.isReady ? "success" : "danger"} style={{width:"18rem"}} >

                    <Card.Header style={{height : "10rem"}}>
                        <h3>{player.Name}</h3>
                        {props.me.isHost ? 
                        <Button style={{}} variant="warning" onClick={()=>{ws.emit("KickPlayer",[player.PlayerId,props.GameId])}}>X</Button>
                        :
                        <span></span>}
                    </Card.Header>
                    <Card.Body>

                        {player.isReady ? <h3> {player.Name} is betting ${player.Bet}</h3> : <h3>Getting Ready...</h3>}   

                    </Card.Body>
                    <Card.Footer>
                        <h4>
                        {player.isReady ? "ready" : "not ready"}
                        </h4>
                    </Card.Footer>
                </Card>)
    }

    function MyCard(me){
        return (<Card bg={me.isReady ? "success" : "danger"} style={{width:"18rem"}} >

            <Card.Header style={{height : "10rem"}}>
                <h3>{me.Name} (You)</h3>
            </Card.Header>
            <Card.Body>                 

                <div>
                    <input type="range" min={1} max={me.Money} onChange={setBet}></input>
                    <input id="betText" type="text" onChange={setBet} placeholder="1"></input>
                </div>

            </Card.Body>
            <Card.Footer>
                <h4>
                {me.isReady ? "ready" : "not ready"}
                </h4>
            </Card.Footer>
        </Card>)
    }

    return(
        <div>

            <div style={{width:"inherit", display:"flex", justifyContent:"center", alignContent:"space-around", marginBottom:"50px"}}>
                {MyCard(props.me)}

            </div>

            <div style={{width:"inherit", display:"block"}}>
            {players ? (<ul style={{display: "flex", justifyContent:"space-around", alignContent:"space-around", paddingLeft:"0px"}}>

{
                players.map(player=>{
                    if(props.playerId === player.PlayerId){
                        return ""
                    } 
                    return (<li style={{ listStyleType:"none"}}>
                        {PlayerCard(player)}
                        
                    </li>)
                })}
            </ul>)
            :
            <p>Lonely Fuck</p>
}
            
            </div>
            <Button variant="danger" onClick={leaveGame} style={{marginRight:"3rem"}}> Leave Game </Button>
            <Button variant="success" onClick={startGame}>Start Game</Button>
        </div>
    )
}

export default Room
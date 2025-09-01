import { Button } from "react-bootstrap"


export default function StartMessage(props){
   
   

    function PlayerGuild(name){
        props.setPlayerGuild(name)
        props.setNickName(document.getElementById("NameInput").value)
    }
    

    function intoSessionStorage(team){
        sessionStorage.setItem("BrainrotCasino", JSON.stringify({name:props.name,money:1000,PlayerId:props.PlayerId, team:team,PlayerName:document.getElementById("NameInput").value}))
        PlayerGuild(team)
    }
    return (<div>
        <h1>Enter your name</h1>
        <input type="text" id="NameInput" placeholder="Enter name here" onChange={(e) => {
            props.setNickName(e.target.value)
        }}>
        </input>
        {props.Name !== "" ? <div>
        {/* <h2>Pick a guild!</h2> */}
        <div style={{display:"block", alignContent:"space-around"}}>
            <Button variant="success" style={{marginLeft:"15px", width:"155px"}} onMouseOver={() =>{}} onClick={() => {intoSessionStorage("Sigma Nation")}}>Proceed</Button>
            
        </div>
    </div>: <p>hi</p>}

    </div>)
}
import TriCard from "./TriCard"
import BlackJack from "./BlackJack"

function GameManager(props){
    var gameCode = props.GameId
    var ws = props.ws
    var setInGame = props.setInGame
    var inGameHandle = props.setInGame
    var setMoney = props.setMoney
    var Me = props.Me
    var GameData = props.GameData.Id !== undefined  ? props.GameData : null
    var setGameData = props.GamedataHandle 
    var Money = props.Money 
    var players = props.lobbyData 
    var setInGame = props.setInGame 
    var setGameCode = props.gameCodeHandle


    

    switch(props.GameMode){
        case "Blackjack":
            return (<BlackJack GameId={gameCode} ws={ws} setInGame={setInGame} setMoney={setMoney} Me={Me} GameData={GameData} GamedataHandle={setGameData} Money={Money} lobbyData={players} inGameHandle = {setInGame} gameCodeHandle = {setGameCode} ></BlackJack>)
        
        case "TriCard":
            return (<TriCard GameId={gameCode} ws={ws} setInGame={setInGame} setMoney={setMoney} Me={Me} GameData={GameData} GamedataHandle={setGameData} Money={Money} lobbyData={players} inGameHandle = {setInGame} gameCodeHandle = {setGameCode} ></TriCard>)
        default:
            return(<h1>Unknown game mode</h1>)
    }
}

export default GameManager
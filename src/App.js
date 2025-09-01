import React, { useEffect, useRef, useState } from 'react';
import TitleScreen from './Title';
import './App.css';
import { ws } from './GetBackend';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import StartMessage from './StartMessage';
import GameManager from './GameMan';
// import {Hand,Player} from "./Player"



function App() {
	const [inGame, setInGame] = useState(false)
	const [gameCode, setGameCode] = useState(0)
	const [gameData, setGameData] = useState({})
	const [Money, setMoney] = useState(1000)
	const [playerId,setPlayerId] = useState(0)
	const [players,setPlayers] = useState([])
	const [playerGuild, setPlayerGuild] = useState("")
	const [nickName, setNickName] = useState("")
	const [gameMode, setGameMode] = useState("Blackjack");
	const Me = useRef({});

	function makeToastMessage(Header, Message, Color) {
		toast(Message, { autoClose: 2000 }, 0);
	}
	useEffect(() => {
		// Define all handler functions outside ws.on/off for stable references
		function returnPlayer(data) {
			setNickName(data.PlayerName)
			setMoney(data.PlayerMoney)
			if (data.PlayerMoney === 0) {
				setMoney(1000)
			}
			setPlayerId(data.PlayerId)
			setPlayerGuild("PlayerGuild")
		}
		function connected() {
			if ("BrainrotCasino" in sessionStorage) {
				console.log(JSON.parse(sessionStorage.getItem("BrainrotCasino")))
				ws.emit("MyData", JSON.parse(sessionStorage.getItem("BrainrotCasino")))
				makeToastMessage("Connected", "Getting your data...", "success")
			} else {
				makeToastMessage("Connected", "Welcome, please enter your name", "success")
			}
		}
		function messaged(message) {
			makeToastMessage(message[0], message[1], message[2])
		}
		function getPlayerId(id) {
			console.log("PlayerId: ", id)
			if (!("BrainrotCasinoId" in sessionStorage)) {
				sessionStorage.setItem("BrainrotCasinoId", id)
			}
			setPlayerId(id)
		}
		function joined(data) {
			setInGame(true)
			setGameCode(data.Id)
			setPlayers(data.Players)
		}
		function err(e) {
			console.error("Error: ", e);
		}
		function create(GameId) {
			setGameCode(GameId)
			setInGame(true)
		}
		function getGameData(data) {
			console.log("HELLO?????")
			setGameData(data)
			setPlayers(data.Players)
		}
		function changeMoney(amount) {
        	sessionStorage.setItem("BrainrotCasino", JSON.stringify({money:amount,PlayerId:playerId, team:playerGuild,PlayerName:nickName}))
			setMoney(amount)
		}
		function Ready(lobby) {
			setPlayers(lobby)
		}
		function playerLeft(lobbyData) {
			setPlayers(lobbyData)
		}
		function KickedEvent(data) {
			setGameCode(0)
			setInGame(false)
			setGameData({})
			setPlayers([])
		}
		function playerJoined(data) {
			setPlayers(data)
		}
		function itsMe(player) {
			Me.current = player
		}
		// Register listeners
		ws.on("SaveData", saveDataHandler)
		ws.on("RETURN", returnPlayer)
		ws.on("connect", connected)
		ws.on("message", messaged)
		ws.on("give_PlayerId", getPlayerId)
		ws.on("OK", okHandler)
		ws.on("Joined", joined)
		ws.on("Failed", err)
		ws.on("Created", create)
		ws.on("GameData", getGameData)
		ws.on("ChangeMoney", changeMoney)
		ws.on("ReadyUp", Ready)
		ws.on("Kicked", KickedEvent)
		ws.on("PlayerLeft", playerLeft)
		ws.on("PlayerJoined", playerJoined)
		ws.on("itsMe", itsMe)
		// Handler function definitions for inline listeners
		function saveDataHandler() {
			ws.emit("DataBase", { PlayerId: playerId, PlayerName: nickName, PlayerMoney: Money })
		}
		function okHandler() {
			console.log("DAWG")
		}
		// Cleanup
		return () => {
			ws.off("SaveData", saveDataHandler)
			ws.off("RETURN", returnPlayer)
			ws.off("connect", connected)
			ws.off("message", messaged)
			ws.off("give_PlayerId", getPlayerId)
			ws.off("OK", okHandler)
			ws.off("Joined", joined)
			ws.off("Failed", err)
			ws.off("Created", create)
			ws.off("GameData", getGameData)
			ws.off("ChangeMoney", changeMoney)
			ws.off("ReadyUp", Ready)
			ws.off("Kicked", KickedEvent)
			ws.off("PlayerLeft", playerLeft)
			ws.off("PlayerJoined", playerJoined)
			ws.off("itsMe", itsMe)
		}
	}, [Money, nickName, playerId, playerGuild])

	return (
		<div className="App">
			
			 
			<p>You have ${Money}</p>
			<ToastContainer position='top-right' >
				
			</ToastContainer>
			{playerGuild === "" ? 
				<StartMessage setPlayerGuild={setPlayerGuild} setNickName={setNickName} Name={nickName} PlayerId={playerId}></StartMessage> 
				:
				inGame ? 
				<GameManager GameMode={gameMode} GameId={gameCode} ws={ws} setInGame={setInGame} setMoney={setMoney} Me={Me.current} GameData={gameData} GamedataHandle={setGameData} Money={Money} lobbyData={players} inGameHandle = {setInGame} gameCodeHandle = {setGameCode} ></GameManager>
				:
				<TitleScreen ws={ws} PlayerId={playerId} Guild={playerGuild} GameMode={gameMode} name={nickName} setGameMode={setGameMode}></TitleScreen>
			}
			
			</div>
	);
}

export default App;

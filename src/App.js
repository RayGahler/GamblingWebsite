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
	const [gameMode, setGameMode] = useState("Blackjack")
	const [nickName, setNickName] = useState("")


	const Me = useRef({})

	function makeToastMessage(Header,Message,Color){
		//ITS THE FUCKING TOAST
		//ITS FUCKING UP THE TIMER
		toast(Message,{autoClose:2000},0)
		
	}


	useEffect(() => {

		

		function returnPlayer(data){
			setNickName(data.PlayerName)
			setMoney(data.PlayerMoney)
			if (data.PlayerMoney === 0){
				setMoney(1000)
			}
			setPlayerId(data.PlayerId)
			setPlayerGuild("LMAO")
		}

		function connected() {
			if("BrainrotCasino" in sessionStorage){
				(sessionStorage.getItem("BrainrotCasinoId"))
				ws.emit("MyData",sessionStorage.getItem("BrainrotCasinoId"))
				makeToastMessage("Connected", "Getting your data...", "success")
			}
			else{
				makeToastMessage("Connected", "Welcome, please enter your name", "success")
			}
		}

		function messaged(message) {
			makeToastMessage(message[0],message[1],message[2])
		}

		function getPlayerId(id) {
			console.log("PlayerId: ", id)
			if(!("BrainrotCasinoId" in sessionStorage)){
				sessionStorage.setItem("BrainrotCasinoId",id)
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
			setMoney(amount)
		}
		
		function timer(t){
			console.log(t)
		}

		function Ready(lobby){
			setPlayers(lobby)
		}

		function playerLeft(lobbyData){
			setPlayers(lobbyData)
		}

		function KickedEvent(data){
			setGameCode(0)
			setInGame(false)
			setGameData({})
			setPlayers([])
			
		}

		ws.on("SaveData", ()=> {
			ws.emit("DataBase", {PlayerId: playerId, PlayerName: nickName, PlayerMoney: Money})
		})

		ws.on("RETURN", returnPlayer)
		ws.on("connect", connected)
		ws.on("message", messaged)
		ws.on("give_PlayerId", getPlayerId)
		ws.on("OK", () => {
			console.log("DAWG")
		})
		ws.on("Joined", joined)
		ws.on("Failed", err)
		ws.on("Created", create)
		ws.on("GameData", getGameData)
		ws.on("ChangeMoney", changeMoney)
		ws.on("Timer",timer)
		ws.on("ReadyUp",Ready)
		ws.on("Kicked",KickedEvent)

		ws.on("PlayerLeft", playerLeft)
		ws.on("PlayerJoined", (data) => {
            
            setPlayers(data)
        })
		ws.on("itsMe", player => {
            Me.current = player
        })
		return () => {
			
			ws.off("SaveData", ()=> {
			// ws.emit("DataBase", {PlayerId: playerId, PlayerName: nickName, PlayerMoney: Money})
		})

			ws.off("ReturnPlayer", returnPlayer)
			ws.off("connect", connected)
			ws.off("message", messaged)
			ws.off("give_PlayerId", getPlayerId)
			ws.off("OK", () => {
				console.log("DAWG")
			})
			ws.off("Joined", joined)
			ws.off("Failed", err)
			ws.off("Created", create)
			ws.off("GameData", getGameData)
			ws.off("ChangeMoney", changeMoney)
			ws.off("timer",timer)
			ws.off("ReadyUp",Ready)
			ws.off("Kicked",KickedEvent)
			
			
			ws.off("PlayerJoined", (data) => {
                setPlayers(data)
            })

			ws.off("itsMe", player => {
				Me.current = player
			})
		}


	})

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

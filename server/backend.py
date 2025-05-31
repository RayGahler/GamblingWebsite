from os import system
from flask import Flask
from flask import request
from flask_socketio import SocketIO,send,emit,join_room,leave_room
from flask_cors import CORS
from random import randint
from Games import Person
from blackjack import BlackJack
from triCard import TriCard
from time import time,sleep
from threading import Thread
from mysql.connector import MySQLConnection as sqlConnector, pooling


app = Flask(__name__)
WebSockApp = SocketIO(app)
WebSockApp.init_app(app,cors_allowed_origins="*")
db_pool = pooling.MySQLConnectionPool(pool_name="TheHouse", pool_size=10, pool_reset_session=True, user= "website", host = "127.0.0.1", password= "password", database= "Casino", ssl_disabled=True)

#Takes Game Ids
games = {}
#Takes player Ids
people: dict[int : Person] = {}

Colors = {"bad" : "danger",
          "good" : "success",
          "primary":"primary",
          "second":"secondary",
          "warn" : "warning",
          "info":"info",
          "light":"light",
          "dark":"dark"}

sidToPlayerId = {}
pidToSID = {}
global count
count = 0

@app.route("/")
def index():
    return "<p> I am alive </p>"

def getPlayerId(ID):
    return sidToPlayerId[ID]


def sendMessage(message,to):
    if to:
        emit("message",[message[0],message[1],Colors[message[2]]],to=to)
    else:
        emit("message",[message[0],message[1],Colors[message[2]]])



@WebSockApp.on("CreateGame")
def CreateGame(data):
    roomMax = data["roomMax"]
    roomMax = int(roomMax)
    GameMode = data["GameMode"]
    if GameMode == "Blackjack":
        curGame = BlackJack(roomMax)
    elif GameMode == "TriCard":
        curGame = TriCard(roomMax)
    player = people[getPlayerId(request.sid)]
    GameId = curGame.Create(player)
    games[GameId] = curGame
    join_room(GameId,request.sid)
    emit("OK", to=request.sid)
    emit("PlayerJoined",games[GameId].JsonPlayers(),to=GameId)
    emit("itsMe",player.Jsonify(),to=request.sid)
    emit("Created",GameId)

@WebSockApp.on("JoinGame")
def JoinGame(GameId):
    try:
        GameId = int(GameId)
    except:
        emit("Failed", "Invalid code",to=request.sid)
        return
    if GameId in games:
        curGame = games[GameId]
        try:
            data = curGame.Join(people[getPlayerId(request.sid)])
        except Exception as e:
            emit("Failed", str(e))
        else:
            join_room(GameId,request.sid)
            emit("OK",to=request.sid)
            emit("itsMe",people[sidToPlayerId[request.sid]].Jsonify(),to=request.sid)
            emit("Joined",data,to=request.sid)

            emit("PlayerJoined", games[GameId].JsonPlayers(),to=GameId)
            sendMessage(["Joined","You have joined the game","good"],request.sid)

    else:
        emit("Failed", "No such room")

@WebSockApp.on("KickPlayer")
def KickPlayer(data):
    PlayerId,GameId = data
    curGame = games[GameId]
    player = people[getPlayerId(request.sid)]
    try:
        PlayerId = int(PlayerId)
        GameId = int(GameId)
    except:
        emit("Failed", "Invalid code",to=request.sid)
        return
    if player.Host == True:
        curGame.removePlayer(PlayerId)
        leave_room(GameId, pidToSID[PlayerId])
        WebSockApp.send(["Player Kicked", "Player has been kicked", Colors["bad"]],to=request.sid)
        emit("PlayerLeft", curGame.JsonPlayers(),to=GameId)
        emit("Kicked", "LMAO", to=pidToSID[PlayerId])
        WebSockApp.send(["Kicked", "You have been kicked", Colors["bad"]],to=request.sid)

    

@WebSockApp.on("Leave")
def LeaveGame(data):
    PlayerId,GameId = data
    game = games[GameId]
    game.removePlayer(PlayerId)
    leave_room(GameId,request.sid)
    emit("PlayerLeft",game.JsonPlayers(),to=GameId)

@WebSockApp.on("Talk")
def Talk(message):
    player = people[getPlayerId(request.sid)]
    GameId = player.Game
    send(message,to=GameId)




@WebSockApp.on("StartGame")
def Start(data):
    """
    Data has the
    Player id
    Game id
    and the players bet
    """
    PlayerId,GameId, bet=data
    curGame = games[GameId]
    data = curGame.Start(people[PlayerId],bet, WebSockApp)
    SendPlayerData(GameId)
    if data:
        emit("GameData",data,to=GameId)
        sendMessage(["Starting game","The game has started","primary"],GameId)
    else:
        emit("ReadyUp",games[GameId].JsonPlayers(),to=GameId)
        return

def SendPlayerData(gameId):
    curGame = games[gameId]
    for players in curGame.Players:
        emit("itsMe",people[players.id].Jsonify(),to=pidToSID[players.id])


@WebSockApp.on("CheckTime")
def Time():
    curPlayer = people[sidToPlayerId[request.sid]]
    curPlayerGame = games[curPlayer.Game]
    if curPlayerGame.timer <= 0:
        curPlayer.IntendMove("Fold")
        GameData = curPlayerGame.ExecuteMove(curPlayer)

        """
        Dealer turn cleans the hand, this is why the cards disappear
        ***
        Fixed :D
        ***
        """
        if GameData:
            emit("itsMe",curPlayer.Jsonify(),to=request.sid)
            if "Dealer" in GameData and GameData["Dealer"]["Turn"]:
                profit = people[sidToPlayerId[request.sid]].toLose
                if profit < 0:
                    sendMessage(["You win!", f"You won {abs(profit)} Dollars", "good"],request.sid)
                elif profit == 0:
                    sendMessage(["You were pushed", f"No Dollars were lost", "warn"],request.sid)
                else:
                    sendMessage(["You lost", f"You lost {abs(profit)} Dollars, L aura", "bad"],request.sid)

                curPlayerGame.cleanAll()
            emit("GameData",GameData,to=curPlayerGame.id)
            emit("turnDone", curPlayer.Jsonify(), to=curPlayerGame.id)


@WebSockApp.on("Intend")
def Intend(data):
    PlayerId = int(data["PlayerId"])
    
    IntendedMove = data["IntendedMove"]
    curPlayer = people[PlayerId]
    curPlayer.IntendMove(IntendedMove)

@WebSockApp.on("Execute")
def Execute(data):
    PlayerId = int(data["PlayerId"])
        
    curPlayer = people[PlayerId]
    if "Intended" in data:
        curPlayer.IntendMove(data["Intended"])
    curPlayerGame= games[curPlayer.Game]
    if not curPlayer.Turn:
        sendMessage(["Not your turn", "Hold the fuck on you stupid prick", "bad"],request.sid)
        return
        
    GameData = curPlayerGame.ExecuteMove(curPlayer)
    
    SendPlayerData(curPlayerGame.id)

    """
    Dealer turn cleans the hand, this is why the cards disappear
    ***
    Fixed :D
    ***
    """
    if GameData:
        
        if "Dealer" in GameData and GameData["Dealer"]["Turn"]:
            profit = people[sidToPlayerId[request.sid]].toLose

            if profit < 0:
                sendMessage(["You win!", f"You won {abs(profit)} Dollars", "good"],request.sid)
            elif profit == 0:
                sendMessage(["You were pushed", f"No Dollars were lost", "warn"],request.sid)
            else:
                sendMessage(["You lost", f"You lost {abs(profit)} Dollars, L aura", "bad"],request.sid)

            curPlayerGame.cleanAll(pidToSID)
        emit("GameData",GameData,to=curPlayerGame.id)
        emit("turnDone", curPlayer.Jsonify(), to=curPlayerGame.id)

@WebSockApp.on("DealersTurn")
def dealersTurn(GameId):
    try:
        GameId = int(GameId)
    finally:
        curGame = games[GameId]
    
    GameData = curGame.DealersTurn()
    emit("GameData",GameData,to=GameId)
    

@WebSockApp.on("GiveName")
def GiveName(data):
    Name,PlayerId = data
    people[PlayerId].Name = Name
    try:
        sqlCon = db_pool.get_connection()
        cursor = sqlCon.cursor()
        cursor.execute("INSERT INTO Player VALUES (%s, %s, 10000)", (PlayerId, Name))
        sqlCon.commit()
        cursor.close()
        sqlCon.close()
    except Exception as e:
        sendMessage(["Something Went Wrong", "Could not save", "bad"],request.sid)

@WebSockApp.on("MyData")
def PutInDB(data):
    sqlCon = db_pool.get_connection()
    cursor = sqlCon.cursor(buffered=True)
    cursor.execute(f"SELECT * FROM Player WHERE PlayerId = {data}")
    (PlayerId, PlayerName, PlayerMoney) = cursor.fetchall()[0]
    
    cursor.close()
    sqlCon.close()
    temp = sidToPlayerId.pop(request.sid)
    pidToSID.pop(temp)
    people.pop(temp)

    sidToPlayerId[request.sid] = PlayerId
    pidToSID[PlayerId] = request.sid
    people[PlayerId] = Person(PlayerId, PlayerName, PlayerMoney)

    emit("RETURN", {"PlayerId": PlayerId, "PlayerName": PlayerName, "PlayerMoney": PlayerMoney}, to=request.sid)

# @WebSockApp.on("DataBase")
# def DataBase(data):
#     PlayerId, PlayerName, PlayerMoney = data["PlayerId"], data["PlayerName"], data["PlayerMoney"]
#     sqlCon = db_pool.get_connection()
#     cursor = sqlCon.cursor()
#     cursor.execute("UPDATE Player SET PlayerName = %s, PlayerMoney = %s WHERE PlayerId = %s", (PlayerName, PlayerMoney, PlayerId))
#     sqlCon.commit()
#     cursor.close()
#     sqlCon.close()
#     sendMessage(["Saved", "Your data has been saved", "good"],request.sid)
    


@WebSockApp.on("connect")
def Connected():
    global count
    count += 1
    pid = randint(1000,9999)
    while pid in pidToSID:
        pid = randint(1000,9999)
    sidToPlayerId[request.sid] = pid
    pidToSID[pid] = request.sid
    people[pid] = Person(pid)

    WebSockApp.emit("give_PlayerId", pid,to=request.sid)


@WebSockApp.on("disconnect")
def Disconnect():
    global count

    PlayerId = getPlayerId(request.sid)
    player = people[PlayerId]
    if player.inGame:
        game = games[player.Game]
        game.removePlayer(PlayerId)
    
    con = db_pool.get_connection()
    cursor= con.cursor() 
    cursor.execute("UPDATE Player SET PlayerMoney = %s WHERE PlayerId = %s", (player.Money, PlayerId))
    cursor.close()
    con.commit()
    con.close()

    people.pop(PlayerId)
    sidToPlayerId.pop(request.sid)
    pidToSID.pop(PlayerId)
    count -= 1



@WebSockApp.on("receive")
def Recieve(message):
    
    print(message)

def targ():


    while 1:
        x = input()
        x = x.split(";")
        WebSockApp.send([x[0], x[1], Colors[x[2].lower()]])
        sleep(.01)

def startFront():
    system("cd .. && npm start")


if __name__ == "__main__":
    tasks = Thread(target=targ)

    tasks.start()
    # Thread(target=startFront).start()
    print("Starting the server")
    WebSockApp.run(app,port=5000,host="0.0.0.0")
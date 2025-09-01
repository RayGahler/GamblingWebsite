import random
import threading
from time import sleep





class Person:
    def __init__(self,PlayerId, Name=None, Money=1000):
        self.id = PlayerId
        self.Guild = None
        self.inGame = False
        self.Game = 0
        self.intendedMove = "Fold"
        self.numHands = 0
        self.Hands = []
        self.HandTurn = 0
        self.Turn = False
        self.Ready = False
        self.Host = False
        self.Name = Name
        self.Bet = None
        self.Money = Money
        self.toLose = 0
        self.inFor = 0
    
    def getCurrentHand(self):
        if self.numHands == 0:
            return None
        return self.Hands[self.HandTurn]

    def Jsonify(self):

        def mapFunc(Hand):
            return Hand.Jsonify()

        Hands = list(map(mapFunc,self.Hands))
        return {
                    "PlayerId" : self.id, 
                    "inGame" : self.inGame,
                    "GameId" : self.Game,
                    "intendedMove" : self.intendedMove,
                    "numberOfHands" : self.numHands,
                    "PlayerHands" : Hands,
                    "handTurn" : self.HandTurn,
                    "Turn" : self.Turn,
                    "isHost" : self.Host,
                    "isReady" : self.Ready,
                    "Name" : self.Name,
                    "Money" : self.Money,
                    "Bet" : self.Bet,
                    "Lost" : self.toLose
                }

    def IntendMove(self,move):
        self.intendedMove = move

    def checkBlackJackWin(self,Dealer):
        for hand in self.Hands:
            if hand.Lost:
                if hand.Doubled:
                    self.toLose += self.Bet*2
                    
                else:
                    self.toLose += self.Bet

            elif hand.Total < Dealer.Hand.Total and not Dealer.Lost:
                if hand.Doubled:
                    self.toLose += self.Bet*2
                else:
                    self.toLose += self.Bet
                hand.Lost = True

            else:
                if hand.Doubled:
                    self.toLose -= self.Bet*2
                else:
                    self.toLose -= self.Bet
        self.Money -= self.toLose

    

    def checkTriCardWin(self,Dealer):
        if self.Hands[0].Folded:
            self.toLose += self.inFor
            return
        
        self.Hands[0].Bonuses()
        self.Hands[0].GetWin()
        Dealer.Bonuses()
        Dealer.GetWin()
        dealerWinMap = Dealer.WinMap
        playerWinMap = self.Hands[0].WinMap

        for p,d in zip(playerWinMap,dealerWinMap):
            if p > d:
                self.toLose -= self.inFor
                break
            elif p == d:
                continue
            else:
                self.toLose += self.inFor
                break


    def Clean(self):
        
        self.inGame = False
        self.intendedMove = "Fold"
        self.Hands = []
        self.Folded = False
        self.Lost = False
        self.Turn = False
        self.HandTurn = 0
        self.numHands = 0
        self.Bet = 0
        self.toLose = 0



    
    

class GamesBlueprint:
    def __init__(self,Max = 5,hasTimer=True,GameId=None) -> None:
        self.id = GameId if GameId else self.genNewCode()
        self.Hands = {}
        self.Players = []
        self.Max = Max
        self.Host = 0
        self.canJoin = False
        self.Turn = 0
        self.timer = 3000
        self.ws = None
        self.Thread = None if hasTimer else -1
        self.goTimer = False

    def Clean(self):
        self.Hands = {}
        self.canJoin = True
        self.Turn = 0
        self.timer = 3000
        self.ws = None
        self.thread :threading.Thread = None

    def removePlayer(self,Player):
        for players in range(len(self.Players)):
            if self.Players[players].id == Player:
                self.Players.pop(players)
                return 
        


    def countDown(self):
        import eventlet
        while self.goTimer:
            print(self.timer)
            if self.timer == 0:
                self.goTimer = False
            eventlet.sleep(1)
            self.timer -= 1
            self.ws.emit("Timer",self.timer,to=self.id)
        

    @property
    def getCode(self):
        return self.id
    
    def Join(self,player : Person):
        if len(self.Players) >= self.Max:
            raise(Exception("Room is full"))
        if not self.canJoin:
            raise(Exception("Game in progress"))
        self.Players.append(player)
        player.inGame = True
        player.Game = self.id
        return {"Players" : self.JsonPlayers(), "roomMax" : self.Max,"Id" : self.id}


    def Create(self,player : Person):
        self.Players.append(player)
        player.Host = True
        player.inGame = True
        player.Game = self.getCode
        self.Host = player.id
        self.canJoin = True
        return player.Game

    def allReady(self):
        for player in self.Players:
            if not player.Ready:
                return False
        return True
    
    def checkCanStart(self,Player,Bet):
        Player.inFor = Bet
        if Player.Money >= Bet:
            Player.Bet = Bet
            Player.Ready = True
        else:
            return False
        if not self.allReady():
            return False
        return True
    

    def Start(self,Player, Bet, ws):
        Bet = int(Bet)
        
        if not self.checkCanStart(Player,Bet):
            return False

        for player in self.Players:
            player.Ready = False

        self.ws = ws
        self.canJoin = False

        self.Turn = 0
        self.Players[0].Turn = True
        if self.Thread != -1:
            self.goTimer = True

            self.Thread = threading.Thread(target=self.countDown)
            try:
                self.Thread.start()
            except:
                print("just doing my job")
        return True

    def JsonPlayers(self):
        def mapFunc(player : Person):
            return player.Jsonify()
        
        newArr = map(mapFunc,self.Players)
        
        return list(newArr)

    def cleanAll(self, someshit=None):
        for player in self.Players:
            player.Clean()
            if someshit:
                self.ws.emit("ChangeMoney",player.Money,to=someshit[player.id])
        self.ws.emit("SaveData",to=self.id)
        self.Dealer.Clean()

    def DealersTurn(self):
        self.goTimer = False

        

    def genNewCode(self):
        return random.randint(1000,9999)
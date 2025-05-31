from Hand import HandBlueprint
from Games import GamesBlueprint
from Games import Person

"""
 2 3 4 5 6 7 8 9 10 J  Q  K  A
 2 3 4 5 6 7 8 9 10 11 12 13 14

 (idx + 1) % 14

"""
cardIndex = {2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,"J":11,"Q":12,"K":13,"A":14}


class Hand(HandBlueprint):
    def __init__(self, DudHand = False) -> None:
        super().__init__()
        self.Dud = DudHand
        self.StraightFlush = False
        self.Trips = False
        self.Straight = False
        self.Flush = False
        self.Pair = False
        self.High = None
        self.Folded = False
        self.Turn = False
        self.WinMap = [0,0,0,0,0,0]
        if DudHand:
            self.Cards = ["?","?","?"]
            self.Suits = ["?","?","?"]
        


    def CheckStraight(self):
        for i in range(len(self.Cards)-1):
            if (cardIndex[self.Cards[i]] + 1) % 14 != self.Cards[i+1]:
                return
        self.Straight = True

    def CheckFlush(self):
        self.Flush = len(set(self.Suits)) == 1

    def CheckTrips(self):
        self.Trips = len(set(self.Cards)) == 1
    
    def CheckPair(self):
        if self.Cards[0] == self.Cards[1] or self.Cards[0] == self.Cards[2]:
            self.Pair = self.Cards[0]
        elif self.Cards[1] == self.Cards[2]:
            self.Pair = self.Cards[1]
        else:
            self.Pair = 0

    def CheckHigh(self):
        curHigh = cardIndex[self.Cards[0]]
        for i in self.Cards:
            if curHigh < cardIndex[i]:
                curHigh = cardIndex[i]
        self.High = curHigh
        
            

    def Bonuses(self):
        self.CheckTrips()
        self.CheckStraight()
        self.CheckFlush()
        self.CheckPair()
        self.CheckHigh()
        self.StraightFlush = self.Flush and self.Straight
    
    def GetWin(self):
        self.WinMap[4] = self.Pair
        self.WinMap[5] = self.High
        self.WinMap[0] = self.High if self.StraightFlush else 0
        self.WinMap[1] = self.High if self.Trips else 0
        self.WinMap[2] = self.High if self.Straight else 0
        self.WinMap[3] = self.High if self.Flush else 0

    def Clean(self):
        self.__init__()

    def Jsonify(self):
        return {"currentHand" : self.Cards, "currentHandSuits" : self.Suits, "Bonus" : {"StraightFlush" : self.StraightFlush, "Trips" : self.Trips, "Straight" : self.Straight, "Flush" : self.Flush , "Pair" : self.Pair, "High" : self.High}, "Dud" : self.Dud, "Turn" : self.Turn}
        

class TriCard(GamesBlueprint):
    def __init__(self, Max=5, hasTimer=True, GameId=None) -> None:
        super().__init__(Max, hasTimer, GameId)
        self.Dealer : Hand = Hand(DudHand=True)
        self.Players = self.Players
        self.Turn = 0

    def Clean(self):
        super().Clean()
        self.Dealer = None


    def ExecuteMove(self,player):
        print("hi")
        print(f"\n\nPlayers move: {player.intendedMove}\n\n")
        if player.intendedMove == "Play":
            self.Play(player)
        elif player.intendedMove == "Fold":
            self.Fold(player)
        else:
            return
        self.Turn += 1
        if self.Turn >= len(self.Players):
            self.DealersTurn()
            self.Turn = 0
        return {"Players" : self.JsonPlayers(), "Dealer" : self.Dealer.Jsonify(), "Hands" : self.Hands, "roomMax" : self.Max,"Id" : self.id}


    def Play(self,Player:Person):
        Player.inFor += Player.Bet

    def Fold(self,Player:Person):
        Player.Hands[0].Folded = True

    def DealersTurn(self):
        self.Dealer = Hand()
        self.Dealer.Draw()
        self.Dealer.Draw()
        self.Dealer.Draw()
        self.Dealer.Turn = True
        for players in self.Players:
            players.checkTriCardWin(self.Dealer)
        super().DealersTurn()
        
    def Start(self, Player:Person, Bet, ws):
        super().Start(Player, Bet, ws)
        
        for players in self.Players:
            players.inFor = players.Bet
            toGive = Hand()
            toGive.Draw()
            toGive.Draw()
            toGive.Draw()
            players.Hands.append(toGive)
        
        return {"Players" : self.JsonPlayers(), "Dealer" : self.Dealer.Jsonify(), "Hands" : self.Hands, "roomMax" : self.Max,"Id" : self.id}


    def JsonPlayers(self):
        def mapFunc(player):
            return player.Jsonify()
        
        newArr = map(mapFunc,self.Players)
        
        return list(newArr)


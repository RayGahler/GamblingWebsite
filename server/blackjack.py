import random
from Hand import HandBlueprint
from Games import GamesBlueprint

class Hand(HandBlueprint):
    def __init__(self,card = None,suit=None) -> None:
        super().__init__()
        if card:
            self.Cards = [card]
            self.Suits = [suit]
            self.Aces = 0
            self.Total = card
            self.Recount()
        else:
            self.Total = 0
            self.Aces = 0
            
            
        self.Lost = False
        self.Stand = False
        self.Splitable = False
        self.Doubled = False
    
    def canSplit(self):
        if not len(self.Cards) == 2:
            return False
        elif self.Cards[0] == self.Cards[1]:
            return True
        elif self.Cards[0] == 10 and type(self.Cards[1]) == str and self.Cards[1] != "A":
            return True
        elif self.Cards[1] == 10 and type(self.Cards[0]) == str and self.Cards[0] != "A":
            return True
        elif type(self.Cards[0]) == str and type(self.Cards[1]) == str and self.Cards[0] != "A":
            return True 
        elif type(self.Cards[0]) == str and type(self.Cards[1]) == str and self.Cards[1] != "A":
            return True 
        return False

    def Split(self):
        if self.Splitable:
            newHand = Hand(self.Cards[1],self.Suits[1])
            self.Cards.pop()
            self.Suits.pop()
            self.Recount()
            return newHand
        else:
            raise(Exception("You can't split"))
    
    def Draw(self) -> None:
        super().Draw()
        drawnCard = self.Cards[-1]
        if type(drawnCard) == str:
            if drawnCard == "A":
                self.Aces += 1
                self.Total += 11
            else:
                self.Total += 10
        else:
            self.Total += drawnCard
        self.Splitable = self.canSplit()
        
    def Recount(self):
        self.Total = 0
        self.Aces = 0
        for card in self.Cards:
            if type(card) == str:
                if card == "A":
                    self.Aces += 1
                    self.Total += 11
                else:
                    self.Total += 10
            else:
                self.Total += card

    def Check(self) -> bool:

        """
            Checks the current Hand object
            returns False if player busted
            returns True otherwise
        """

        if self.Total > 21 and not self.Aces:
            self.Lost = True
            return False
        elif self.Aces and self.Total > 21:
            self.Total -= 10
            self.Aces -= 1
            
        return True
    
    """
    -1 = Loss
    0 = Keep Going
    1 = Fold
    """
    def dealerCheck(self):

        """
            Checks if the dealer has lost
            returns: 
            -1 = Loss
            0 = Keep Going
            1 = Fold
        """
            
        if self.Total > 21:
            if self.Aces:
                self.Total -= 10
                self.Aces -= 1
                return 0
            return -1
        elif self.Total >= 17:
            return 1
        
        
        
        return 0

    def Jsonify(self):
        return {"currentHand" : self.Cards, "currentHandSuits" : self.Suits, "Total" : self.Total, "Lost" : self.Lost, "Stand" : self.Stand, "canSplit" : self.Splitable}
    
    
class Dealer:
    def __init__(self):
        self.Hand = None
        self.Folded = False
        self.Lost = False
        self.turn = False
    
    def Jsonify(self):
        return {
                "Hand" : None if not self.Hand else self.Hand.Jsonify(),
                "Folded" : self.Folded,
                "Lost" : self.Lost,
                "Turn" : self.turn
                }
    
    def Clean(self):
        self.Hand = None
        self.Folded = False
        self.Lost = False
        self.turn = False




class BlackJack(GamesBlueprint):
    def __init__(self,roomMax=5) -> None:
        super().__init__(roomMax)
        self.Dealer = None
    

    def Clean(self):
        super().Clean()
        self.Dealer.Clean()
    
    def Start(self,Player, Bet, ws):
        if not super().Start(Player,Bet,ws):
            return

        for Player in self.Players:
            Player.Hands.append(Hand())
            Player.Hands[0].Draw()
            Player.Hands[0].Draw()
            Player.numHands = 1

        self.Dealer = Dealer()
        self.Dealer.Hand = Hand()
        self.Dealer.Hand.Draw()
        return {"Players" : self.JsonPlayers(), "Hands" : self.Hands, "roomMax" : self.Max,"Id" : self.id, "Dealer" : self.Dealer.Jsonify()}


    def ExecuteMove(self,player):
        print(f"\n\nPlayers move: {player.intendedMove}\n\n")
        handTurn = player.HandTurn
        currentHand = player.Hands[handTurn]
        self.timer += 10
        if player.intendedMove == "Hit":
            currentHand.Draw()
            currentHand.Check()
        elif player.intendedMove == "Fold":
            currentHand.Stand = True
        elif player.intendedMove == "Double":
            """
            Basically just hit and then fold
            """
            if player.inFor + player.Bet > player.Money or len(player.getCurrentHand().Cards) != 2:
                return
            else:
                player.Hands[player.HandTurn].Doubled = True
                player.inFor += player.Bet

            currentHand.Draw()
            currentHand.Check()
            currentHand.Stand = True

        elif player.intendedMove == "Split":
            if player.inFor + player.Bet > player.Money:
                return
            else:
                player.inFor += player.Bet

            newHand = currentHand.Split()
            player.numHands += 1
            player.Hands.append(newHand)
            

        if currentHand.Lost or currentHand.Stand:
            if player.HandTurn+1 == player.numHands:
                player.Turn = False
                self.Turn += 1
                self.timer = 30
                if self.Turn >= len(self.Players):
                    player.Turn = False
                    self.Turn = 0
                    self.Dealer.Turn = True
                    return self.DealersTurn()
                else:
                    self.Players[self.Turn].Turn=True
            else:
                player.HandTurn += 1
                self.timer = 30
            
        player.intendedMove = "Fold" 

        return {"Players" : self.JsonPlayers(), "Hands" : self.Hands, "roomMax" : self.Max,"Id" : self.id, "Dealer" : self.Dealer.Jsonify()}
        
        
    def JsonPlayers(self):
        def mapFunc(player):
            return player.Jsonify()
        
        newArr = map(mapFunc,self.Players)
        
        return list(newArr)

    def DealersTurn(self):
        self.Dealer.turn = True
        fin = self.Dealer.Hand.dealerCheck()
        while fin == 0:
            self.Dealer.Hand.Draw()
            fin = self.Dealer.Hand.dealerCheck()
        
        if fin == -1:
            self.Dealer.Lost = True
        else:
            self.Dealer.Folded = True
        
        self.canJoin = True

        for player in self.Players:
            player.checkBlackJackWin(self.Dealer)

        toRet = {"Players" : self.JsonPlayers(), "Hands" : self.Hands, "roomMax" : self.Max,"Id" : self.id, "Dealer" : self.Dealer.Jsonify()}

        self.goTimer = False
        return toRet
        


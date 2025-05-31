import random

class HandBlueprint:
    def __init__(self) -> None:
        self.Vals = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"]
        self.CardSuits = ["Hearts", "Spades", "Diamonds", "Clubs"]
        self.Cards = []
        self.Suits = []
        self.Lose = False
            
        
    
    def Draw(self) -> None:
        drawnCard = random.choice(self.Vals)
        drawnSuit = random.choice(self.CardSuits)

        self.Cards.append(drawnCard)
        self.Suits.append(drawnSuit)
        
    

function PlayingCard(props){
    
    /* 
    
    Thank god I had python to make this all for me

    */
    
    var cardPaths = {
        '?' : {"?" : <Dud></Dud>},
        'A': {'Clubs': <AofClubs></AofClubs>, 'Diamonds':<AofDiamonds></AofDiamonds>, 'Hearts':<AofHearts></AofHearts>, 'Spades':<AofSpades></AofSpades>},
        2: {'Clubs':<TwoofClubs></TwoofClubs>, 'Diamonds':<TwoofDiamonds></TwoofDiamonds>, 'Hearts':<TwoofHearts></TwoofHearts>, 'Spades':<TwoofSpades></TwoofSpades>},
        3: {'Clubs':<ThreeofClubs></ThreeofClubs>, 'Diamonds':<ThreeofDiamonds></ThreeofDiamonds>, 'Hearts':<ThreeofHearts></ThreeofHearts>, 'Spades':<ThreeofSpades></ThreeofSpades>},
        4: {'Clubs':<FourofClubs></FourofClubs>, 'Diamonds':<FourofDiamonds></FourofDiamonds>, 'Hearts':<FourofHearts></FourofHearts>, 'Spades':<FourofSpades></FourofSpades>},
        5: {'Clubs':<FiveofClubs></FiveofClubs>, 'Diamonds':<FiveofDiamonds></FiveofDiamonds>, 'Hearts':<FiveofHearts></FiveofHearts>, 'Spades':<FiveofSpades></FiveofSpades>},
        6: {'Clubs':<SixofClubs></SixofClubs>, 'Diamonds':<SixofDiamonds></SixofDiamonds>, 'Hearts':<SixofHearts></SixofHearts>, 'Spades':<SixofSpades></SixofSpades>},
        7: {'Clubs':<SevenofClubs></SevenofClubs>, 'Diamonds':<SevenofDiamonds></SevenofDiamonds>, 'Hearts':<SevenofHearts></SevenofHearts>, 'Spades':<SevenofSpades></SevenofSpades>},
        8: {'Clubs':<EightofClubs></EightofClubs>, 'Diamonds':<EightofDiamonds></EightofDiamonds>, 'Hearts':<EightofHearts></EightofHearts>, 'Spades':<EightofSpades></EightofSpades>},
        9: {'Clubs':<NineofClubs></NineofClubs>, 'Diamonds':<NineofDiamonds></NineofDiamonds>, 'Hearts':<NineofHearts></NineofHearts>, 'Spades':<NineofSpades></NineofSpades>},
        10: {'Clubs':<TenofClubs></TenofClubs>, 'Diamonds':<TenofDiamonds></TenofDiamonds>, 'Hearts':<TenofHearts></TenofHearts>, 'Spades':<TenofSpades></TenofSpades>},
        'J': {'Clubs':<JofClubs></JofClubs>, 'Diamonds':<JofDiamonds></JofDiamonds>, 'Hearts':<JofHearts></JofHearts>, 'Spades':<JofSpades></JofSpades>},
        'Q': {'Clubs':<QofClubs></QofClubs>, 'Diamonds':<QofDiamonds></QofDiamonds>, 'Hearts':<QofHearts></QofHearts>, 'Spades':<QofSpades></QofSpades>},
        'K': {'Clubs':<KofClubs></KofClubs>, 'Diamonds':<KofDiamonds></KofDiamonds>, 'Hearts':<KofHearts></KofHearts>, 'Spades':<KofSpades></KofSpades>}
    }


    var numb = props.cardNumb
    var suit = props.cardSuit
    var path = cardPaths[numb][suit]

    return path
}

function Dud(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/2_of_hearts.png")}></img>
}

function AofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/ace_of_clubs.png")}></img>
}

function AofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/ace_of_diamonds.png")}></img>
}

function AofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/ace_of_hearts.png")}></img>
}

function AofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/ace_of_spades.png")}></img>
}

function TwoofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/2_of_clubs.png")}></img>
}

function TwoofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/2_of_diamonds.png")}></img>
}

function TwoofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/2_of_hearts.png")}></img>
}

function TwoofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/2_of_spades.png")}></img>
}

function ThreeofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/3_of_clubs.png")}></img>
}

function ThreeofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/3_of_diamonds.png")}></img>
}

function ThreeofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/3_of_hearts.png")}></img>
}

function ThreeofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/3_of_spades.png")}></img>
}

function FourofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/4_of_clubs.png")}></img>
}

function FourofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/4_of_diamonds.png")}></img>
}

function FourofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/4_of_hearts.png")}></img>
}

function FourofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/4_of_spades.png")}></img>
}

function FiveofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/5_of_clubs.png")}></img>
}

function FiveofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/5_of_diamonds.png")}></img>
}

function FiveofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/5_of_hearts.png")}></img>
}

function FiveofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/5_of_spades.png")}></img>
}

function SixofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/6_of_clubs.png")}></img>
}

function SixofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/6_of_diamonds.png")}></img>
}

function SixofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/6_of_hearts.png")}></img>
}

function SixofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/6_of_spades.png")}></img>
}

function SevenofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/7_of_clubs.png")}></img>
}

function SevenofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/7_of_diamonds.png")}></img>
}

function SevenofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/7_of_hearts.png")}></img>
}

function SevenofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/7_of_spades.png")}></img>
}

function EightofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/8_of_clubs.png")}></img>
}

function EightofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/8_of_diamonds.png")}></img>
}

function EightofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/8_of_hearts.png")}></img>
}

function EightofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/8_of_spades.png")}></img>
}

function NineofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/9_of_clubs.png")}></img>
}

function NineofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/9_of_diamonds.png")}></img>
}

function NineofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/9_of_hearts.png")}></img>
}

function NineofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/9_of_spades.png")}></img>
}

function TenofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/10_of_clubs.png")}></img>
}

function TenofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/10_of_diamonds.png")}></img>
}

function TenofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/10_of_hearts.png")}></img>
}

function TenofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/10_of_spades.png")}></img>
}

function JofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/jack_of_clubs2.png")}></img>
}

function JofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/jack_of_diamonds2.png")}></img>
}

function JofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/jack_of_hearts2.png")}></img>
}

function JofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/jack_of_spades2.png")}></img>
}

function QofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/queen_of_clubs2.png")}></img>
}

function QofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/queen_of_diamonds2.png")}></img>
}

function QofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/queen_of_hearts2.png")}></img>
}

function QofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/queen_of_spades2.png")}></img>
}

function KofClubs(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/king_of_clubs2.png")}></img>
}

function KofDiamonds(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/king_of_diamonds2.png")}></img>
}

function KofHearts(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/king_of_hearts2.png")}></img>
}

function KofSpades(){
    return <img style={{width : "12%"}} alt="Fuckin Card breh" src={require("./PNG-cards-1.3/king_of_spades2.png")}></img>
}

export default PlayingCard



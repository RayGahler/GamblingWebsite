import PlayingCard from "./PlayingCard"

function Dealer(props){
    var cards = props.Cards
    var suits = props.Suits
    var zipped = []
    for(var idx = 0; idx < cards.length; idx++){
        zipped.push([cards[idx], suits[idx]])
    }
    return(
        <div id="Dealer">
            
            {zipped.map((card) => {
                return <PlayingCard cardNumb= {card[0]} cardSuit={card[1]}></PlayingCard>
            })}
            <br></br>
            <h4>Total: {props.Total}</h4>
            <br></br>
        </div>
    )
}

function Player(props){
    var cards = props.Cards
    var suits = props.Suits
    var zipped = []
    for(var idx = 0; idx < cards.length; idx++){
        zipped.push([cards[idx], suits[idx]])
    }

    return(
        <div style={{paddingTop:"2rem"}}>
            {zipped.map((card) => {
                return <PlayingCard cardNumb= {card[0]} cardSuit={card[1]}></PlayingCard>
            })}
            <br></br>
            <h4>Total: {props.Total}</h4>
            <br></br>
        </div>
    )
}

export {Dealer,Player}

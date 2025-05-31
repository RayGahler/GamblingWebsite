import { Component } from "react"
import {GetBackend} from "./GetBackend"


class Hand extends Component{

    constructor(){
        super()
    }

    hit(){
    }

}

class Player extends Component{
    constructor(playerId){
        super()
        this.playerId = playerId
    }

}

export {Hand,Player}
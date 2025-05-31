import React from "react";
import { Toast } from "react-bootstrap";

class Notification extends React.Component{
    
    constructor(){
        super()
        this.state = {message : "Welcome to sigma nation"}
    }
    
    ChangeMessage(message){
        this.setState({message:message})
    }
    
    render(){

        return(
            <Toast>
                <Toast.Body>
                    {this.state[message]}
                </Toast.Body>
            </Toast>
        )
    }
}
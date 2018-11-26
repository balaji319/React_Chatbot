import React, { Component } from 'react'

class Chatbot extends Component {

    constructor(props) {
        super(props)
        this.state = {
            messages:[]
        }
    }

    render() {
        return (
            <div style={{height:400, width:400 , float:'right'}}>
                <div id="chatbot" style={{height:'100%', width:'100%', overflow:'auto'}}>
                    <h4>Chatbot</h4>
                    <input type="text"  style={{height:'77%'}}/>
                </div>

            </div>
        )
    }
}



export default Chatbot
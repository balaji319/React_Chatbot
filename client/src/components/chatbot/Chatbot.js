import React, { Component } from 'react'
import axios from 'axios/index'
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid'
import { withRouter } from "react-router-dom";
import Message from './Message';
import Card from './Card'
import QuickReplie from './QuickReplie';


const cookies = new Cookies();

class Chatbot extends Component {
    messagesEnd;
    constructor(props) {
        super(props)
        this.state = {
            messages:[],
            showBot: true,
            talkInput:'',
            ShopWelcomeSend:false
        }

        if(cookies.get('userID') === undefined) {
            cookies.set('userID',uuid(), { path:'/'});
        }
       console.log(cookies.get('userID'))
    }

    //For Set Default Message To DialogFLow
    componentDidMount() {
        this.df_event_query('hi');

        if( window.location.pathname=='/shop' && !this.state.ShopWelcomeSend) {
            this.df_event_query('WELCOME_SHOP');
            this.setState({ShopWelcomeSend:true})
        }

        this.props.history.listen(() => {
            if(this.props.history.location.pathname === '/shop' && !this.state.ShopWelcomeSend) {
                this.df_event_query('WELCOME_SHOP');
                this.setState({ShopWelcomeSend:true})
            }
        })
    }

    //For Set Auto-Scroll The Message Screen
    componentDidUpdate()  {
        this.messagesEnd.scrollIntoView( {behaviour: 'smooth'});
        if ( this.talkInput ) {
            this.talkInput.focus();
        }
    }

    hide = () => {
        this.setState({showBot: false});
    }

    show = () => {
        this.setState({showBot: true});
    }
    //Async Fnction For Text Query
    async df_text_query(text) {
        let says = {
          speaks:'me',
          msg:{
            text:{
              'text':text
            }
          }
        }
        this.setState({messages: [...this.state.messages, says]})
        const res = await axios.post('http://localhost:5000/api/df_text_query', {text, userID:cookies.get('userID')})
        for(let msg of res.data.fulfillmentMessages) {
            console.log('from text query')
            console.log(JSON.stringify(msg))
            says = {
                speaks:'bot',
                msg: msg
            }
            this.setState({messages : [...this.state.messages, says]})
        }
      }

      //Async Function For Event Query
      async df_event_query(event) {
        const res = await axios.post('http://localhost:5000/api/df_event_query', {event, userID:cookies.get('userID')})
        for(let msg of res.data.fulfillmentMessages) {
            console.log('from event query')
            console.log(JSON.stringify(msg))
            let says = {
                speaks:'bot',
                msg:msg
            }

            this.setState({messages : [...this.state.messages, says]})
        }
      }

      //For Handle Quick Replies
      _handleQuickReplies = (payload, text) => {
          switch(payload) {
              case 'recommand_yes':
                this.df_event_query('SHOW_RECOMMANDATION')
            break;
            case 'training_masterclass':
                this.df_event_query('MASTERCLASS')
            break;

            default:
            this.df_text_query(text)
            break
        }
      }

      //Check Key Press Event
      _handleKeyPressEvent = (e) => {
        if(e.key=='Enter') {
            console.log('send to server');
            this.df_text_query(e.target.value)
            e.target.value='';
        }
      }

      //Render Recommandations Cards
      renderCard = (cards) => {
          return cards.map((card, i) => <Card key={i} payload={card.structValue} />)
      }

      //Check Render Message Text Or Message Recommandation Payload
      renderOneMessage(message, i) {
        if(message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>
        }
        else if(message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.cards){
            return <div key={i}>
                <div className="card-panel lighten -5 z-depth-1 ">
                    <div style={{overflow:'hidden'}}>
                        <div className="col s2">
                        <a className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                        </div>
                        <div style={{overflow:'auto', overflow:'scroll'}}>
                            <div style={{height:300, width:message.msg.payload.fields.cards.listValue.values.length * 120, display: 'inline-flex'}}>
                                    {this.renderCard(message.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        else if(message.msg &&message.msg.payload && message.msg.payload.fields &&
                message.msg.payload.fields.quick_replies
        ) {
            return (<QuickReplie
                text={message.msg.payload.fields.text? message.msg.payload.fields.text : null}
                key={i}
                replayClick={this._handleQuickReplies}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values}
           />)

        }
      }

      //Render Message For Display On Screen
      renderMessage(stateMessages) {
        if(stateMessages) {
            return stateMessages.map((message,i)=>{
                return this.renderOneMessage(message, i)
            })
        } else{
            return null;
        }
      }

    //Render HTML Section Will Be Here
    render() {
         if(this.state.showBot) {
            return (
                <div style={{height:500, width:400 , position:'relative', float: 'right',bottom:0, right:0, border:'1px solid lightgrey'}}>
                    <nav className="nav-wrapper">
                        <a className="brand-logo">ChatBot</a>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a onClick={this.hide}>Close</a></li>
                        </ul>
                    </nav>
                    <div id="chatbot" style={{height:388, width:'100%', overflow:'auto'}}>
                        { this.renderMessage(this.state.messages)}
                        <div ref={(el) => { this.messagesEnd = el; }}
                         style={{float:'left', clear:'both'}}>
                        </div>
                    </div>
                    <div className="col s12">
                        <input type="text" ref={(input) => { this.talkInput = input; }}  onKeyPress={this._handleKeyPressEvent} style={{margin:0, paddingLeft:'1%', width:'98%'}} placeholder="type a message"/>
                    </div>
                </div>
            )
         } else {
            return <div style={{ height: 40, width:400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray'}}>
            <nav>
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo">ChatBot</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a onClick={this.show}>Show</a></li>
                    </ul>
                </div>
            </nav>
            <div style={{ float:"left", clear: "both" }}
                 ref={(el) => { this.messagesEnd = el; }}>
            </div>
         </div>
         }
    }
}



export default withRouter(Chatbot)
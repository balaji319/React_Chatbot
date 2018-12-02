import React, {Component} from 'react'
import QuickReplay from './QuickReplay'

class QuickReplie extends Component {
    constructor(props) {
        super(props)
    }

    _handleClick= (payload, text) => {
        this.props.replayClick(payload, text)
    }

    renderQuickReplay = (replay, i) => {
        return <QuickReplay key={i} click={this._handleClick} replay={replay} />
    }

    _renderQuickReplies = (quickreplies) => {
        if(quickreplies) {
            return quickreplies.map((replay, i) => {
                return this.renderQuickReplay(replay, i)
            })
        } else {
            return null;
        }
    }
    render() {
        return (
            <div className="col s12 m8 offset-m2 offset-13">
                <div className="card-panel gery lighten-5 z-depth-1">
                    <div className="row valign-wrapper">
                        <div className="col s2">
                            <a className="btn-floating btn-large waves-effect waves-light red">{this.props.speaks}</a>
                        </div>
                        <div id="quick_replies" className="col s10">
                            {  <p>
                                {this.props.text.stringValue}
                            </p>
                            }
                            {this._renderQuickReplies(this.props.payload)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default QuickReplie
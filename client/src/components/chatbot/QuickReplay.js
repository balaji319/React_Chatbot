import React from 'react'

const QuickReplay = (props) => {
    if(props.replay.structValue.fields.payload) {
        return (
            <a style={{margin:3}} className="btn-floating btn-large waves-effect waves-light red"
                onClick={() => {
                    props.click(
                        props.replay.structValue.fields.payload.stringValue,
                        props.replay.structValue.fields.text.stringValue
                    )
                }}
            >
                {props.replay.structValue.fields.text.stringValue}
            </a>
        )
    } else {
        return(
            <a className="btn-floating btn-large waves-effect waves-light red"
                href={props.replay.structValue.fields.link.stringValue}
            >
                {props.replay.structValue.fields.text.stringValue}
            </a>
        )
    }

}


export default QuickReplay
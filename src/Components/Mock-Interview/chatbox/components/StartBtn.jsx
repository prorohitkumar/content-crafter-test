import React from 'react'

export default function StartBtn(props) {

    const initialAction = () => {
        props.actions.initialAction();
    }

    return (
        <div>
            <button className='start-btn' onClick={() => initialAction()}>Click here to Start</button>
        </div >
    )
}
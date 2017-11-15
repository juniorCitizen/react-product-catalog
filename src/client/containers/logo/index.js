import React from 'react'

export default class Logo extends React.Component {
    render() {
        return(     
            <div className="" style={style.box}>       
                <h1 className="title">
                    This is LOGO!!!
                </h1>
            </div>
        )
    }
}

const style = {
    box: {
        height: '80px',
        marginTop: '10px',
        marginBottom: '12px',
    },
}
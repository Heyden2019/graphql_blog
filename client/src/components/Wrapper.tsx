import React from 'react'
import NavBar from './NavBar';

const Wrapper = ({children}: any) => {
    return (
        <div>
                <NavBar />
    <div className="content">{children}</div>
            
        </div>
    )
}

export default Wrapper

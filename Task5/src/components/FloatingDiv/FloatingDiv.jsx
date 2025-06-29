import React, { useContext } from 'react'
import crown from '../../img/crown.png'
import './FloatingDiv.css'
import { themeContext } from '../../Context';

const FloatingDiv = ({ txt1, txt2 }) => {
 
    return (
        <div>
            <div className="floatingdiv">
                <img src={crown} alt="" />
                <span>
                    {txt1}
                    <br />
                    {txt2}
                </span>
            </div>
        </div>
    )
}

export default FloatingDiv
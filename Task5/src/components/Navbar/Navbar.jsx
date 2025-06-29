import React from 'react'
import './Navbar.css'
import Toggle from '../Toggle/Toggle'
import { Link } from 'react-scroll';
const Navbar = () => {
    return (
        <div className='n-wrapper'>
            <div className="n-left">
                <div className="n-name">
                    Aniket
                </div>
                <Toggle />
            </div>
            <div className="n-right">
                <div className="n-list">
                    <ul>
                        <Link spy={true} to={Navbar}
                            smooth={true}
                            activeClass='active'>
                            <li>Home</li></Link>
                        <Link spy={true} to='Services'
                            smooth={true}
                            activeClass='active'>
                            <li>Services</li></Link>
                        <Link spy={true} to='Portfolio'
                            smooth={true}
                            activeClass='active'>
                            <li>Portfolio</li></Link>
                        <Link spy={true} to='Skills'
                            smooth={true}
                            activeClass='active'>
                            <li>Skills</li></Link>

                    </ul>
                </div>
                <Link spy={true} to='contact' smooth={true}>
                    <button className="button n-button">Contact Me</button>
                </Link>
            </div>

        </div>
    )
}

export default Navbar
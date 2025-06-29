


import React, { useContext } from 'react';
import './Intro.css';
import Github from '../../img/github.png';
import LinkedIn from '../../img/linkedin.png';
import Instagram from '../../img/instagram.png';
import glassesimoji from '../../img/glassesimoji.png';
import FloatingDiv from '../FloatingDiv/FloatingDiv';
import { themeContext } from '../../Context';
import { motion } from 'framer-motion';
import boy from '../../img/boy.png'
import boy3 from '../../img/boy3.jpg'
import { Link } from 'react-scroll';

const Intro = () => {
  const transition = { duration: 2, type: 'spring' };

  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div className="intro">
      <div className="left">
        <div className="name">
          <span style={{ color: darkMode ? 'white' : '' }}>Hi! I Am</span>
          <span>Aniket Gupta</span>
          <span>Full Stack Web Developer Based In India</span>
        </div>
        <Link spy={true} to='contact' smooth={true}>
          <button className="button i-button">Hire me</button>
        </Link>

        <div className="icons">
          <a href="https://github.com/Aniket067">
            <img src={Github} alt="" />
          </a>
          <a href="https://www.linkedin.com/in/aniket-gupta-9998aa24a">
            <img src={LinkedIn} alt="" />
          </a>
          <a href="https://www.instagram.com/aniketgupta110/">
            <img src={Instagram} alt="" />
          </a>
        </div>
      </div>
      <div className="right">
        <motion.img
          initial={{ left: '-36%' }}
          whileInView={{ left: '-24%' }}
          transition={transition}
          src={glassesimoji}
          alt=""
          className="glassesimoji"
        />
        <motion.div
          initial={{ top: '-4%', left: '74%' }}
          whileInView={{ left: '68%' }}
          transition={transition}
          className="floatdiv"
        >
          <FloatingDiv txt1="Web" txt2="Developer" />
        </motion.div>
        <motion.div
          initial={{ left: '9rem', top: '18rem' }}
          whileInView={{ left: '0rem' }}
          transition={transition}
          className="floatdiv1"
        >
          <FloatingDiv txt1="Problem" txt2="Solver" />
        </motion.div>
        {/* Photo Frame */}
        <div className="photo-frame">
          <img src={boy3} alt="Aniket Gupta" className="photo" />
        </div>
        <div className="blur"></div>
        <div className="blur1 blur"></div>
      </div>
    </div>
  );
};

export default Intro;

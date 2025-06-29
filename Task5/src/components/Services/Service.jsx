import React, { useContext } from 'react';
import './Service.css';
import HeartEmoji from '../../img/heartemoji.png';
import glasses from '../../img/glasses.png';
import humble from '../../img/humble.png';
import Card from '../Card/Card';
import resume from './resume.pdf';
import { themeContext } from '../../Context';
import { motion } from 'framer-motion';

const Service = () => {
  const transition = { duration: 3, type: 'spring' };
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div className='services' id='Services'>
      {/* left */}
      <div className="awesome">
        <span style={{ color: darkMode ? "white" : "" }}>
          My Awesome
        </span>
        <span>Services</span>
        <span>
          Custom Web Design: Create stunning, user-friendly websites.
          <br />
          Responsive Web Development
        </span>
        <a href={resume} download>
          <button className='button s-button'>
            Download CV
          </button>
        </a>
        <div className="blur s-blur"></div>
      </div>

      {/* right */}
      <div className="cards">
        <motion.div
          initial={{ left: '25%' }}
          whileInView={{ left: '25rem' }}
          transition={transition}
          style={{ left: '14rem' }}
        >
          <Card
            emoji={glasses}
            heading={'Frontend Development'}
            detail={"JavaScript, React, Next.js, CSS (Tailwind CSS)"}
          />
        </motion.div>
        {/* 2nd card */}
        <motion.div
          initial={{ left: '-20%' }}
          whileInView={{ left: '-4rem' }}
          transition={transition}
          style={{ top: "12rem" }}
        >
          <Card
            emoji={HeartEmoji}
            heading={'Backend Development'}
            detail={"Node.js, Express, MongoDB, CMS"}
          />
        </motion.div>
        {/* 3rd card */}
        <motion.div
          initial={{ left: '20%' }}
          whileInView={{ left: '14rem' }}
          transition={transition}
          style={{ top: "24rem" }}
        >
          <Card
            emoji={humble}
            heading={'Problem Solving'}
            detail={"C++, Java, Algorithm Design"}
          />
        </motion.div>
        <div className="blur s-blur2" style={{ background: "var(--purple)" }}></div>
      </div>
    </div>
  );
}

export default Service;

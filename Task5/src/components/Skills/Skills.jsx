

import React, { useContext, useEffect, useState } from 'react';
import './Skills.css';
import { themeContext } from '../../Context';
import { motion, useAnimation } from 'framer-motion';

import Upwork from '../../img/Upwork.png'
import Fiverr from '../../img/fiverr.png'
import Amazon from '../../img/amazon.png'
import Shopify from '../../img/Shopify.png'
import Facebook from '../../img/Facebook.png';
import Express from '../../img/express.png';
import Git from '../../img/git.png';
import Tailwind from '../../img/tailwind.png';
import Framer from '../../img/framer.png';
import Figma from '../../img/figma.png';
import { Link } from 'react-scroll';

const Skills = () => {
    const theme = useContext(themeContext);
    const darkMode = theme.state.darkMode;

    // Array of sets of images
    const imagesSets = [
        [
            { src: Upwork, alt: 'C++' },
            { src: Fiverr, alt: 'Node' },
            { src: Amazon, alt: 'Nextjs' },
            { src: Shopify, alt: 'Mongo' },
            { src: Framer, alt: 'Framer' }
        ],
        [
            { src: Facebook, alt: 'REact' },
            { src: Express, alt: 'Express' },
            { src: Git, alt: 'Git' },
            { src: Tailwind, alt: 'Tailwind' },
            { src: Figma, alt: 'Figma' }
        ],
        
    ];

    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const mainCircleControls = useAnimation();

    useEffect(() => {
        const rotateAnimation = async () => {
            // Start rotating animation
            await mainCircleControls.start({
                rotate: 360,
                transition: { duration: 5, ease: "linear" }
            });

            // Calculate next set index
            const nextSetIndex = (currentSetIndex + 1) % imagesSets.length;

            // Rotate back to the original position
            await mainCircleControls.start({
                rotate: 0,
                transition: { duration: 0 }
            });

            // Update set and image indices after a short delay
            setTimeout(() => {
                setCurrentSetIndex(nextSetIndex);
                setCurrentImageIndex(0); // Reset image index to start from the first image of the new set
            }, 500); // Adjust this delay as needed

        };

        rotateAnimation();
    }, [mainCircleControls, imagesSets, currentSetIndex]);

    return (
        <div className='skills' id='Skills'>
            <div className="awesome">
                <span style={{ color: darkMode ? "white" : "" }}>My </span>
                <span>Skills</span>
                <span>
                    Proficient in React and JavaScript frameworks
                    <br />
                    Experience with Node.js and Express for backend development
                    <br />
                    Skilled in CSS and responsive design with styled-components
                    <br />
                    Familiar with version control systems like Git
                </span>
                <Link spy={true} to='contact' smooth={true}>
                <button className='button s-button'>
                    Hire Me
                </button>
                </Link>
                <div className="blur s-blur"></div>
            </div>

            {/* right  */}
            <div className="w-right">
                <motion.div className="w-maincircle" animate={mainCircleControls}>
                    {imagesSets[currentSetIndex].map((image, index) => (
                        <div key={index} className="w-secCirlce">
                            <motion.img
                                src={image.src}
                                alt={image.alt}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    ))}
                </motion.div>
                <div className="w-bgcircle bluecircle"></div>
                <div className="w-bgcircle yellowcircle"></div>
            </div>
        </div>
    );
};

export default Skills;

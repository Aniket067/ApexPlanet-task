
import React, { useContext } from "react";
import "./Portfolio.css";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css";
import { themeContext } from "../../Context";
import Brainwave from '../../img/Brainwave.png'
import biteblitz from '../../img/biteblitz.png'
import resume from '../../img/resume.png'
import tripplanner from '../../img/project4.png'

const Portfolio = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  return (
    <div className="portfolio" id="portfolio">
      {/* heading */}
      <span style={{ color: darkMode ? 'white' : '' }}>Recent Projects</span>
      <span>Portfolio</span>

      {/* slider */}
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        grabCursor={true}
        className="portfolio-slider"
      >
        <SwiperSlide>
          <a href="https://github.com/Aniket067/Brainwave">

            <img src={Brainwave} alt="" />
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="https://github.com/Aniket067/BiteBlitz-FullStack">

            <img src={biteblitz} alt="" />
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">

            <img src={resume} alt="" />
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <a href="">

            <img src={tripplanner} alt="" />
          </a>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Portfolio;
import React from "react";
import "./Footer.css";
import Wave from "../../img/wave.png";
import Code from "@iconscout/react-unicons/icons/uil-brackets-curly";  // Import the correct Code icon
import LinkedIn from "@iconscout/react-unicons/icons/uil-linkedin";
import Gitub from "@iconscout/react-unicons/icons/uil-github";

const Footer = () => {
  return (
    <div className="footer">
      <img src={Wave} alt="" style={{ width: "100%" }} />
      <div className="f-content">
        <span>aniketgupta2405@gmail.com | +91 63939646220</span>
        <div className="f-icons">
          <a href="https://leetcode.com/u/Aniket_Gupta110/">

            <Code color="white" size={"3rem"} />
          </a>
          <a href="https://www.linkedin.com/in/aniket-gupta-9998aa24a">

            <LinkedIn color="white" size={"3rem"} />
          </a>
          <a href="https://github.com/Aniket067">

            <Gitub color="white" size={"3rem"} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;

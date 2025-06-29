import React, { useContext } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Intro from './components/Intro/Intro'
import Service from './components/Services/Service'
import Skills from './components/Skills/Skills'
import Portfolio from './components/portfolio/Portfolio'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import { themeContext } from './Context'

function App() {
  const theme= useContext(themeContext) ;
  const darkMode = theme.state.darkMode;
  return (
    <>
    <div className='App'
    style={{
      background:darkMode?'black':'',
      color:darkMode?'white':''
    }}
    >

      <Navbar/>
      <Intro/>
      <Service/>
      <Portfolio/>
      <Skills/>
      <Contact/>
      <Footer/>
    </div>
    </>
  )
}

export default App
import React from 'react';
import { Container } from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom'; // Importa useHistory
import Button from './Button'
import { Footer } from './footer/Footer';
import { Nav } from './nav/Nav';
import axios from 'axios';
import { generateGameId } from './Util';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';

let topics

const Menu = () => {

    const navigation = useNavigate(); 

    const getTopics = async () => {
      try {
        topics = await axios.get(`${apiEndpoint}/topics`)
        topics = topics.data
      } catch(error) {
        console.error(error)
      }
    }

    const initiateGame = async () => {
      await getTopics()  
      navigation("/gameConfiguration", {state: {topics}})
    }

    const initiateCalculator = async () => {
      let gameId = await generateGameId();  
      navigation("/calculator", {state: {gameId}})
    }

    return (
      <>
        <Nav />
        <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
          <h2>Modos de juego:</h2>
          <div className='modes'>
              <Button text = "Clásico" name="quiz" onClick={() => initiateGame()}/>
              <Button text = "Calculadora Humana" name="calc" onClick={() => initiateCalculator()}/>
          </div>
          
        </Container>
        <Footer />
      </>
    );
}

export default Menu;
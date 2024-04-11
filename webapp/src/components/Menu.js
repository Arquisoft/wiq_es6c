import React from 'react';
import { Container } from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useHistory
import Button from './Button'
import { Footer } from './footer/Footer';
import { Nav } from './nav/Nav';
import {shuffleArray} from './Util'

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';

var gameId;
//var isApiCalledRef = false;//ASK - is this necessary?


var questions = []

const Menu = () => {

    const navigation = useNavigate(); 

    /*
    const [selectedButtonCustomize, isSelectedButtonCustomize] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    */

    const initiateGame = async () => {
      await generateGameId();  
      await getQuestions()  
      //isApiCalledRef = true//ASK - is this necessary?
      navigation("/firstGame", {state: {questions, gameId}})
    }

    const generateGameId = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/generateGameUnlimitedQuestions`)
        console.log(response.data)
        gameId = response.data
      } catch(error) {
        console.error(error);
      }
    }

    const getQuestions = async () => {
        try {
          const response = await axios.get(`${apiEndpoint}/gameUnlimitedQuestions`, {gameId});
          console.log(response.data.length)
          for (var i = 0; i < response.data.length; i++) {
            var possibleAnswers = [response.data[i].respuesta_correcta, response.data[i].respuestas_incorrectas[0], response.data[i].respuestas_incorrectas[1], response.data[i].respuestas_incorrectas[2]]
            possibleAnswers = shuffleArray(possibleAnswers)
            questions.push({
              question: response.data[i].pregunta,
              options: possibleAnswers,
              correctAnswer: response.data[i].respuesta_correcta
            })
          }      
        } catch (error) {
          console.error(error);
        }
        console.log(questions)
    };

    const openStoredQuestions = async () => {
      navigation("/appQuestion")
    }

    const openHistory = async () => {
      navigation("/history")
    }

    

    return (
      <>
        <Nav />
        <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
          <h2>Modos de juego:</h2>
          <div className='modes'>
              <Button text = "Clásico" name="quiz" onClick={() => initiateGame()}/>
          </div>
          
        </Container>
        <Footer />
      </>
    );
}

export default Menu;
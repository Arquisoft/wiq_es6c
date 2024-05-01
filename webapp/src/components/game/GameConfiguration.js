import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import Button from '../Button';
import { useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios'
import { shuffleArray, generateGameId } from '../Util';
import './GameConfiguration.css';
import Spinner from '../spinner/Spinner';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';

let gameId;


const GameConfiguration = () => {
  let questions = []
  const navigation = useNavigate();
    let tematicas = ['Paises', 'Capitales'];
    let state = useLocation().state;

    if( state !== null)
      tematicas = state.topics;

    // Almacen de temáticas 
    const [tematicasSeleccionadas, setTematicasSeleccionadas] = useState([]);
    
    let numPreguntas = 10;

    let numRes = 2

    const handleTematicaChange = (event) => {
        const tematicaSeleccionada = event.target.value;

        if (tematicasSeleccionadas.includes(tematicaSeleccionada)) {
        // Si está seleccionada -> la eliminamos
        setTematicasSeleccionadas(
            tematicasSeleccionadas.filter(tema => tema !== tematicaSeleccionada));
        } else {
        setTematicasSeleccionadas([...tematicasSeleccionadas, tematicaSeleccionada]);
        }
    };


  const initiateGame = async () => {
    //Sacar número de preguntas y respuestas
    const numQuestions =  parseInt(document.getElementById("questionsSpinner").innerText);
    const numRespuestas = parseInt(document.getElementById("answersSpinner").innerText);

    numPreguntas = numQuestions;
    numRes = numRespuestas;

    gameId = await generateGameId();  
    await getQuestions();
    navigation("/firstGame", {state: {questions, gameId}})
  }

  function formatearTopics() {
    let topicsFormated = '';

    for (const tema of tematicasSeleccionadas) {
      topicsFormated += `&tema=${tema}`;
    }

    return topicsFormated
  }

  const getQuestions = async () => {
    try {
      const topicsFormated = formatearTopics()
      const response = await axios.get(`${apiEndpoint}/questions?n_preguntas=${numPreguntas}&n_respuestas=${numRes}${topicsFormated}`);
      for (const pregunta of response.data) {
        let possibleAnswers = [pregunta.respuesta_correcta]
        for (const respuestaIncorrecta of pregunta.respuestas_incorrectas) {
          possibleAnswers.push(respuestaIncorrecta)
        }
        possibleAnswers = shuffleArray(possibleAnswers)
        questions.push({
          question: pregunta.pregunta,
          options: possibleAnswers,
          correctAnswer: pregunta.respuesta_correcta
        })
      }   
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Nav />
      <Container id="config" component="main" maxWidth="xl" sx={{ marginTop: 4 }}>

        <h2>Configuración de la partida</h2>
        
        <div className="configureTopic">

            <h3>Selecciona las temáticas</h3>

           {tematicas.map((option, index) => (
              <div>
                <input
                type="checkbox"
                id={`t${index}`}
                value={option}
                className='option-input'
                onChange={handleTematicaChange}
              />
              <label htmlFor={`t${index}`}>{option}</label>
              </div>
            )
            )}
        </div>


        <div className="configureNumberOfQuestions">

          <h3>Selecciona el número de preguntas</h3>

          <div>
            <label htmlFor="numPreguntas">Número de preguntas:</label>
            <Spinner min={1} value={10} max={50} id="questionsSpinner"/>
          </div>

        </div>

        <div className="configureNumberOfAnswers">

          <h3>Selecciona el número de respuestas(mínimo 2)</h3>

          <div>
            <label htmlFor="numRes">Número de respuestas:</label>
            <Spinner min={2} value={2} max={10} id="answersSpinner"/>
          </div>

          

        </div>

        <Button id="initGame" onClick={initiateGame} text="Comenzar Juego"/>
            
      </Container>
      <Footer />
    </>
  );

}

export default GameConfiguration;
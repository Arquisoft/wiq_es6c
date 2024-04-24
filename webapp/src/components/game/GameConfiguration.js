import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import Button from '../Button';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useHistory
import axios from 'axios'
import { shuffleArray } from '../Util';
import './GameConfiguration.css';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';

let gameId;
let questions = []
const previousBackgroundColor = '#1a1a1a'

const GameConfiguration = () => {

    let tematicas
    let state = useLocation().state
    if( state !== null)
      tematicas = state.topics;
    else
      tematicas = []
    console.log(tematicas)


    const navigation = useNavigate(); 
    // Almacen de temáticas 
    const [tematicasSeleccionadas, setTematicasSeleccionadas] = useState([]);
    // Almacen para el número de preguntas
    const [numPreguntas, setNumPreguntas] = useState(1); 
    // Almacen de mensaje de error para el spinner
    const [error, setError] = useState(null); 


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

    const handleNumPreguntasChange = (event) => {
        const nuevoValor = parseInt(event.target.value, 10);

        if (!isNaN(nuevoValor) && nuevoValor > 0) {
        setNumPreguntas(nuevoValor);
        setError(null); // Reseteamos el error si el valor es válido
        } else {
        setError("El número de preguntas debe ser mayor que 0");
        }
    };

  const initiateGame = async () => {
    console.log(tematicasSeleccionadas)
    console.log(numPreguntas)
    await generateGameId();  
    await getQuestions()  
    //isApiCalledRef = true//ASK - is this necessary?
    // navigation("/firstGame", {state: {questions, gameId}})
  }

  const generateGameId = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/generateGame`)
      console.log(response.data)
      gameId = response.data
    } catch(error) {
      console.error(error);
    }
  }

  const getQuestions = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/gameQuestions`, {gameId, tematicasSeleccionadas});
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
  }

  return (
    <>
      <Nav />
      <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>

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
                // checked={tematicasSeleccionadas.includes({option})}
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
            <input
              type="number"
              id="numPreguntas"
              value={numPreguntas}
              onChange={handleNumPreguntasChange}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>

        </div>

        
        <Button onClick={initiateGame} text='Comenzar Juego'/>
        
            
      </Container>
      <Footer />
    </>
  );

}

export default GameConfiguration;
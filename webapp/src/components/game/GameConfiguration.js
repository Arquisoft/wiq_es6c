import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';
import Button from '../Button';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useHistory
import axios from 'axios'
import { shuffleArray } from '../Util';
import './GameConfiguration.css';
import Spinner from '../spinner/Spinner';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';

let gameId;
let questions = []

const GameConfiguration = () => {

  const navigation = useNavigate();
    let tematicas = [];
    let state = useLocation().state;

    console.log(state)

    if( state !== null)
      tematicas = state.topics;
    console.log(tematicas)

    // Almacen de temáticas 
    const [tematicasSeleccionadas, setTematicasSeleccionadas] = useState([]);
    // Almacen para el número de preguntas
    const [numPreguntas, setNumPreguntas] = useState(1); 
    // Almacen de mensaje de error para el spinner
    const [error, setError] = useState(null); 

    const [numRes, setNumRes] = useState(2);

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

    const handleNumResChange = (event) => {
      const nuevoValor = parseInt(event.target.value, 10);

      if (!isNaN(nuevoValor) && nuevoValor > 1) {
        setNumRes(nuevoValor);
        setError(null); // Reseteamos el error si el valor es válido
        } else {
        setError("El número de respuestas debe ser mayor que 2");
        }
    }

  const initiateGame = async () => {
    await generateGameId();  
    await getQuestions();
    //isApiCalledRef = true//ASK - is this necessary?
    navigation("/firstGame", {state: {questions, gameId}})
  }

  const generateGameId = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/generateGame`)
      gameId = response.data
    } catch(error) {
      console.error(error);
    }
  }

  function formatearTopics() {
    var topicsFormated = ''

    for (var i = 0; i < tematicasSeleccionadas.length; i++) {
      topicsFormated += ("&tema=" + tematicasSeleccionadas[i]) 
    }

    return topicsFormated
  }

  const getQuestions = async () => {
    try {
      const topicsFormated = formatearTopics()
      const response = await axios.get(`${apiEndpoint}/questions?n_preguntas=${numPreguntas}&n_respuestas=${numRes}${topicsFormated}`);
      for (var i = 0; i < response.data.length; i++) {
        var possibleAnswers = [response.data[i].respuesta_correcta]
        for (var j = 0; j < response.data[i].respuestas_incorrectas.length; j++) {
          possibleAnswers.push(response.data[i].respuestas_incorrectas[j])
        }
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

        <div className="configureNumberOfAnswers">

          <h3>Selecciona el número de respuestas(mínimo 2)</h3>

          <div>
            <label htmlFor="numRes">Número de respuestas:</label>
            <input
              type="number"
              id="numRes"
              value={numRes}
              onChange={handleNumResChange}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>

          <Spinner min={2} value={2}/>

        </div>

        <Button onClick={initiateGame} text="Comenzar Juego"/>
            
      </Container>
      <Footer />
    </>
  );

}

export default GameConfiguration;
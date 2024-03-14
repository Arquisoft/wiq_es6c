import Question from './components/Question';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/questions.css';
import { useNavigate } from 'react-router-dom'; // Importa useHistory

function App(){
    /*const newQuestion = {
        question: '¿Cuál es tu pregunta?',
        answers: ['Respuesta 1', 'Respuesta 2', 'Respuesta 3', 'Respuesta 4']
    };

    const newQuestion1 = {
        question: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
        answers: ['Segovia','León','Valladolid','Ninguna'],
      };
      const newQuestion2 = {
        question: '¿Cuál es la capital Italia?',
        answers: ['Roma','Nápoles','Florencia','Milán'],
      };
      const newQuestion3 = {
        question: '¿Cuál es el país mas poblado de la tierra?',
        answers: ['China','Estados Unidos','Brazil','India'],
      };

      let preguntas = [newQuestion, newQuestion1, newQuestion2, newQuestion3]*/
      
      const [preguntas, setPreguntas] = useState([]);

      const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

      const navigation = useNavigate();
      
      useEffect(() => {
        
        const obtenerPreguntas = async () => {
          try {
            const response = await axios.get(`${apiEndpoint}/history/questions`)
            setPreguntas(response.data);
          } catch (error) {
            console.error('Error al obtener las preguntas:', error.response.data.error);
          }
        };
    
        obtenerPreguntas();
        //eslint-disable-next-line
      }, []);

      const goBack = async () => {
        navigation('/menu')
      }

    return (
      <div id='storeQuestion'>
        <h2>Almacén de preguntas</h2>
        <button
              name="openStoredQuestions"
              onClick={() => goBack()}
              style={{backgroundColor: 'lightgrey'}}
            >
              Volver al menu
            </button>
        <main className='grid'>
          {preguntas.map(question => (
            <Question key={question._id} newQuestion={question} />
          ))}
        </main>
      </div>
    );

    /*
          <Question newQuestion={newQuestion} />
          <Question newQuestion={newQuestion2} />
          <Question newQuestion={newQuestion1} />
          <Question newQuestion={newQuestion3} />
    */
}

export default App;
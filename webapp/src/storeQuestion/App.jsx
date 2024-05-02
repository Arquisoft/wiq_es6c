import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/questions.css';
import Question from './components/Question';
import Button from '../components/Button';
import { Nav } from "../components/nav/Nav";
import { Footer } from "../components/footer/Footer";

function App() {
  const [preguntas, setPreguntas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de preguntas por página

  const apiEndpoint = process.env.REACT_APP_APIS_ENDPOINT || 'http://localhost:8100';

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/history/questions`);
        setPreguntas(response.data);
      } catch (error) {
        if('response' in error && 'data' in error.response && 'error' in error.response.data)
          console.error('Error al obtener las preguntas:', error.response.data.error);
        else
          console.error('Error al obtener las preguntas:', error)
      }
    };

    obtenerPreguntas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular el índice inicial y final de las preguntas a mostrar en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = preguntas.slice(startIndex, endIndex);

  // Funciones para cambiar de página
  const nextPage = () => {
    if(currentPage < Math.ceil(preguntas.length / itemsPerPage))
      setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if(currentPage !== 1)
      setCurrentPage(currentPage - 1);
  };

  const firstPage = () => {
    setCurrentPage(1);
  }

  const lastPage = () => {
    setCurrentPage(Math.ceil(preguntas.length / itemsPerPage));
  }

  const refresh = () => {
    setCurrentPage(currentPage);
  }

  return (<>
    <Nav />

    <div id='storeQuestion'>
      <h2>Almacén de preguntas</h2>
      <main className='grid'>
        {currentQuestions.map(question => (
          <Question key={question._id} newQuestion={question} />
        ))}
      </main>
      <footer className='pagination'>
        <Button text='Primera' onClick={firstPage}/>
        <Button text='Anterior' onClick={prevPage}/>
        <Button text={''+currentPage} onClick={refresh} />
        <Button text='Siguiente' onClick={nextPage}/>
        <Button text='Última' onClick={lastPage} />
      </footer>
    </div>

    <Footer />
    </>
  );
}

export default App;
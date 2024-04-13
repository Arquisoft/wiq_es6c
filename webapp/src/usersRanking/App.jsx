import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/users.css';
import User from './components/Users';
import Button from '../components/Button';
import { Nav } from "../components/nav/Nav";
import { Footer } from "../components/footer/Footer";

function App() {

  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de usuarios

  const apiEndpoint = process.env.REACT_APIS_ENDPOINT || 'http://localhost:8100';

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/users`);
        setUsuarios(response.data);
      } catch (error) {
        if('response' in error && 'data' in error.response && 'error' in error.response.data)
          console.error('Error al obtener las usuarios:', error.response.data.error);
        else
          console.error('Error al obtener las usuarios:', error)
      }
    };

    obtenerUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular el índice inicial y final de las usuarios a mostrar en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = usuarios.slice(startIndex, endIndex);

  // Funciones para cambiar de página
  const nextPage = () => {
    if(currentPage < Math.ceil(usuarios.length / itemsPerPage))
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
    setCurrentPage(Math.ceil(usuarios.length / itemsPerPage));
  }

  const refresh = () => {
    setCurrentPage(currentPage);
  }

  return (<>
    <Nav />

    <div id='storeUser'>
      <h2>Almacén de usuarios</h2>
      <main className='grid'>
        {currentUsers.map(user => (
          <User key={user._id} newUser={user} />
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
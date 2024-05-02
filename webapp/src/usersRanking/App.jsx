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
  const itemsPerPage = 10; // Número de usuarios por página

  const apiEndpoint = process.env.REACT_APIS_ENDPOINT || 'http://localhost:8100';

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/usersStats`);
        setUsuarios(response.data);
      } catch (error) {
        if('response' in error && 'data' in error.response && 'error' in error.response.data)
          console.error('Error al obtener los usuarios:', error.response.data.error);
        else
          console.error('Error al obtener los usuarios:', error)
      }
    };

    obtenerUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular el índice inicial y final de los usuarios a mostrar en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let currentUsers = usuarios.slice(startIndex, endIndex);

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

  const sortUsers = (field) => {
    let sortedUsers = [];
    switch (field) {
      case 'username':
        sortedUsers = usuarios.slice().sort((a, b) => (a.username > b.username) ? 1 : -1);
        break;
      case 'tpoints':
        sortedUsers = usuarios.slice().sort((a, b) => a.tpoints - b.tpoints).reverse();
        break;
      case 'avgpoints':
        sortedUsers = usuarios.slice().sort((a, b) => a.avgpoints - b.avgpoints).reverse();
        break;
      case 'ttime':
        sortedUsers = usuarios.slice().sort((a, b) => a.ttime - b.ttime).reverse();
        break;
      case 'avgtime':
        sortedUsers = usuarios.slice().sort((a, b) => a.avgtime - b.avgtime).reverse();
        break;
      default:
        sortedUsers = usuarios.slice();
        break;
    }
    setUsuarios(sortedUsers);
  };  

  return (
    <>
      <Nav />
      <div id='storeUser'>
        <h2>Ranking de usuarios</h2>
        <table>
          <thead>
            <th scope='col'>
              <Button text='Nombre de Usuario' onClick={() => sortUsers('username')} />
            </th>
            <th scope='col'>
              <Button text='Puntos totales' onClick={() => sortUsers('tpoints')} />
            </th>
            <th scope='col'>
              <Button text='Puntos promedio' onClick={() => sortUsers('avgpoints')} />
            </th>
            <th scope='col'>
              <Button text='Tiempo Total' onClick={() => sortUsers('ttime')} />
            </th>
            <th scope='col'>
              <Button text='Tiempo promedio' onClick={() => sortUsers('avgtime')} />
            </th>
          </thead>
          <tbody >
            {currentUsers.map(user => (
              <User key={user._id} newUser={user} />
            ))}
          </tbody>
        </table>
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

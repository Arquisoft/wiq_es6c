import Game from "./components/Game";
import "./css/Game.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from "../components/Button";
import { Nav } from "../components/nav/Nav";
import { Footer } from "../components/footer/Footer";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de partidas por página

  const [games, setGames] = useState([]);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const username = localStorage.getItem('username');

  useEffect(() => {

    const getGames = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/history/games/${username}`)
        setGames(response.data);
      } catch (error) {
        console.error('Error al obtener los juegos:', error);
      }
    };

    getGames();
    //eslint-disable-next-line
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGames = games.slice(startIndex, endIndex) || [];
  console.log(currentGames)

  // Funciones para cambiar de página
  const nextPage = () => {
    if(currentPage < Math.ceil(games.length / itemsPerPage))
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
    setCurrentPage(Math.ceil(games.length / itemsPerPage));
  }

  const refresh = () => {
    setCurrentPage(currentPage);
  }

  return (

    <>
      <Nav />

      <div id="history">
        <div className="header">
          <h2>Historial de {username}</h2>
        </div>
        <main>
          {currentGames.map(game => (
            <Game key={game.id} game={game} />
          ))}
        </main>
        <footer className="pagination">
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
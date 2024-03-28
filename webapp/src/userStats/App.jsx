import Game from "./components/Game";
import "./css/Game.css"
import GoBackButton from "../components/GoBackButton";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [games, setGames] = useState([]);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const username = localStorage.getItem('username');

  useEffect(() => {

    const getGames = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/history/getgames?username=` + username)//
        setGames(response.data);
      } catch (error) {
        console.error('Error al obtener los juegos:', error.response.data.error);
      }
    };

    getGames();
    //eslint-disable-next-line
  }, []);

  return (
    <div id="history">
      <div className="header">
        <h2>Historial de {username}</h2>
      </div>
      <GoBackButton />
      <main>
        {games.map(game => (
          <Game key={game.id} game={game} />
        ))}
      </main>
    </div>
  );
}

export default App;
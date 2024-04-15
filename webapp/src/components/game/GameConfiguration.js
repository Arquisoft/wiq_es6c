import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';


const GameConfiguration = () => {

  // Almacen de temáticas 
  const [tematicasSeleccionadas, setTematicasSeleccionadas] = useState([]);


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


  return (
    <>
      <Nav />
      <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>

        <h2>Configuración de la partida</h2>
    
        <div className="configureTopic">

          <h3>Selecciona las temáticas:</h3>

          <div>
            <input
              type="checkbox"
              id="t1"
              value="Arte"
              checked={tematicasSeleccionadas.includes('Arte')}
              onChange={handleTematicaChange}
            />
            <label htmlFor="tematica1">Arte</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="t2"
              value="Ciencia"
              checked={tematicasSeleccionadas.includes('Ciencia')}
              onChange={handleTematicaChange}
            />
            <label htmlFor="tematica2">Ciencia</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="t3"
              value="Geografía"
              checked={tematicasSeleccionadas.includes('Geografía')}
              onChange={handleTematicaChange}
            />
            <label htmlFor="tematica3">Geografía</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="t4"
              value="Entretenimiento"
              checked={tematicasSeleccionadas.includes('Entretenimiento')}                
              onChange={handleTematicaChange}
              />
            <label htmlFor="tematica4">Entretenimiento</label>
          </div>
    
        </div>
    
    
        <GoBackButton/>
            
      </Container>
      <Footer />
    </>
  );

};

export default GameConfiguration;
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';


function CircularProgress() {
    const [percentage, setPercentage] = useState(100);
    var control = 100
    useEffect(() => {
      const intervalId = setInterval(() => {
        // Generar un nuevo porcentaje de progreso aleatorio (solo para propósitos de demostración)
        control = control - 1
        setPercentage(control); // Actualizar el estado con el nuevo porcentaje
      }, 100); // Intervalo de 1000 milisegundos (1 segundo)
  
      // Limpiar el intervalo cuando el componente se desmonte
      return () => clearInterval(intervalId);
    }, []); // La dependencia vacía asegura que useEffect solo se ejecute una vez al montar el componente
  
    return (
      <div style={{ width: '100px' }}>
        <CircularProgressbar value={percentage}/>
      </div>
    );
  }


  export default CircularProgress();
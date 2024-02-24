import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';



function CircularProgress(initialValue) {
    const [percentage, setPercentage] = useState(initialValue);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setPercentage(prevPercentage => prevPercentage - 1); // Actualizar el estado con el nuevo porcentaje
      }, 100); // Intervalo de 100 milisegundos (0.1 segundo)
  
      // Limpiar el intervalo cuando el componente se desmonte
      return () => clearInterval(intervalId);
    }, []); // La dependencia vacía asegura que useEffect solo se ejecute una vez al montar el componente
    
    var listaDevolver = [<CircularProgressbar value={percentage}/>, percentage]
    return (
        listaDevolver
    );
  }

  export default CircularProgress;
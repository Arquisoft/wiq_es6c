import React, { useState, useEffect } from 'react';

const ProgressBar = () => {

    const [progress, setProgress] = useState(0); // Inicialmente al 0%
    const duration = 30; // Duración en segundos

    useEffect(() => {
        const interval = setInterval(() => {
            // Actualizar el progreso cada segundo
            setProgress((prevProgress) => prevProgress + 100 / duration);
        }, 1000);

        // Limpiar el intervalo 
        return () => clearInterval(interval);
    }, []);

    const progressBarStyle = {
        width: '${progress}%',
        height: '20px',
        backgroundColor: 'green',
    };

    return (
        <div>
            <div style={progressBarStyle}>

            </div>

            <p>{Math.round(progress)}%</p>
        </div>
    );
};

export default ProgressBar;
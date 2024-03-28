import Question from "./Question";//Might be ../storeQuestion in a future
import React, { useState } from 'react';

function Game(props){
    const {game} = props

    const [isOpen, setIsOpen] = useState(true);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown">
            <div className="header">
                <h3>{game.createdAt.substring(0,10)} - {game.points} puntos</h3>
                <button className="dropdown-button" onClick={toggleDropdown}>{isOpen ? '▲' : '▼'}</button>
            </div>
            {isOpen && (
                <div className="dropdown-content">
                    
                    <div className="game">
                        {game.questions.map(question => (
                            <Question newQuestion={question}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;
import Question from './components/Question';

function App(){
    const newQuestion = {
        question: '¿Cuál es tu pregunta?',
        answers: ['Respuesta 1', 'Respuesta 2', 'Respuesta 3', 'Respuesta 4']
    };

    const newQuestion1 = {
        question: '¿Cuál es la capital de la comunidad autónoma de Castilla y León?',
        answers: ['Segovia','León','Valladolid','Ninguna'],
      };
      const newQuestion2 = {
        question: '¿Cuál es la capital Italia?',
        answers: ['Roma','Nápoles','Florencia','Milán'],
      };
      const newQuestion3 = {
        question: '¿Cuál es el país mas poblado de la tierra?',
        answers: ['China','Estados Unidos','Brazil','India'],
      };
    
    return (
        <>
          <Question newQuestion={newQuestion} />
          <Question newQuestion={newQuestion2} />
          <Question newQuestion={newQuestion1} />
          <Question newQuestion={newQuestion3} />
        </>
    );
}

export default App;
import Game from "./components/Game";
import "./css/Game.css"
function App(){

    let games = [
        { id: 0, username: 'user1', points: 1, questions: [{ title: 'Question 1', answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'], ansIndex: [1,1] },{ title: 'Question 2', answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'], ansIndex: [2,1] },{ title: 'Question 3', answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'], ansIndex: [3,1] }] },
        { id: 1, username: 'user1', points: 1, questions: [{ title: 'Question 1', answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'], ansIndex: [1,1] },{ title: 'Question 2', answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'], ansIndex: [2,1] }]},
        { id: 2, username: 'user1', points: 0, questions: [{ title: 'Question 1', answers: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'], ansIndex: [0,1] }]}
    ]

    /*const [preguntas, setPreguntas] = useState([]);

      useEffect(() => {
        const obtenerPreguntas = async () => {
          try {
            const response = await axios.get('http://localhost:8004/questions').then(setPreguntas(response.data)).error();
            console.log(response)
            //setPreguntas(response.data);
          } catch (error) {
            console.error('Error al obtener las preguntas:', error.response.data.error);
          }
        };
    
        obtenerPreguntas();
      }, []);*/


    return (
      <>
        <div className="header">
            <h2>Historial de {games[0].username}</h2>
        </div>
        <main>
            {games.map(game => (
            <Game key={game.id} game={game} />
            ))}
        </main>
      </>
    );
}

export default App;
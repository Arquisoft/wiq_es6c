import { Nav } from "../components/nav/Nav";
import { Footer } from "../components/footer/Footer";

function Help(){
    return (<>
            <Nav />

            <h2>
              Cómo jugar
            </h2>
            <pre>
              Cuando inicies una parte en cualquier modo de juego, se irán mostrando preguntas junto 
              con 4 posibles respuestas. Para cada pregunta: 
            </pre>
            <ul>
              <li>Únicamente habrá una respuesta correcta.</li>
              <li>Tendrás un tiempo máximo para contestar. </li>
              <li>Si la respuesta seleccionada es correcta, se mostrará en verde. </li>
              <li>Si la respuesta seleccionada es incorrecta, se mostrará en rojo y en verde la correcta. </li>
            </ul>
            <pre>
              Cada vez que se muestre una pregunta habrá una barra que represente el tiempo restante 
              para contestarla. Si el tiempo se termina, la pregunta contará como fallada y se pasará 
              a la siguiente.
            </pre>
            <pre>
              ¡Demuestra tus conocimientos!
            </pre>

            <Footer />
            </>);
}

export default Help;
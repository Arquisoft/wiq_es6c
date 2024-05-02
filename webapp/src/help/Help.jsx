import { Nav } from "../components/nav/Nav";
import { Footer } from "../components/footer/Footer";
import "./css/help.css"

function Help() {
  return (
    <>
      <Nav />

      <div id="help">
        <h2>Cómo jugar</h2>

        <section id="instructions">
          <div className="border">
            <article id="classic" className="inner">
              <h3>Clásico</h3>
              <p>
                Al seleccionar este modo de juego, podrás configurar tu partida de forma que escogerás:
              </p>
              <ul>
                <li>Las temáticas de las preguntas.</li>
                <li>El número de preguntas totales. </li>
                <li>El número de posibles respuestas por pregunta. </li>
              </ul>
              <p>
                Una vez realizada la configuración, comenzará la partida con tantas preguntas y posibles
                respuestas como hayas escogido.
                Para cada pregunta:
              </p>
              <ul>
                <li>Únicamente habrá una respuesta correcta.</li>
                <li>Tendrás un tiempo máximo para contestar. </li>
                <li>Si la respuesta seleccionada es correcta, se mostrará en verde y se sumarán 100 puntos. </li>
                <li>Si la respuesta seleccionada es incorrecta, se mostrará en rojo, la correcta en verde y no se modificarán los puntos. </li>
                <li>Si se agota el tiempo y no se ha seleccionado una respuesta, se mostrará la correcta en verde y no se modificarán los puntos. </li>
              </ul>
              <p>
                Al final de la partida se guardarán las preguntas, las respuestas y los puntos obtenidos.
              </p>
              <p>
                ¡Demuestra tus conocimientos!
              </p>
            </article>
          </div>

          <div className="border">
            <article id="calculator" className="inner">
              <h3>Calculadora humana</h3>
              <p>
                Con este modo de juego mostrarás tus habilidades de cálculo mental. Las operaciones a realizar pueden ser
                sumar, restas, multiplicaciones y divisiones.
              </p>
              <ul>
                <li>Habrá 4 respuestas de las cuales sólo una será correcta.</li>
                <li>Tendrás que contestar el mayor número de pregutnas que puedas en un tiempo límite.</li>
                <li>Si la respuesta seleccionada es correcta, se mostrará en verde y se sumarán 100 puntos. </li>
                <li>Si la respuesta seleccionada es incorrecta, se mostrará en rojo, la correcta en verde y no se modificarán los puntos. </li>
                <li>Si se agota el tiempo y no se ha seleccionado una respuesta, se mostrará la correcta en verde y no se modificarán los puntos. </li>
              </ul>
              <p>
                ¿Te atreves a poner a prueba tus habilidades de cálculo mental?
              </p>
            </article >
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Help;
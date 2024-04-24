import React from 'react';
import { Container } from '@mui/material';
import './FirstGame.css';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom'; // Importa useHistory
import Button from './Button'
import { Footer } from './footer/Footer';
import { Nav } from './nav/Nav';
import {shuffleArray} from './Util'
import axios from 'axios';


//var isApiCalledRef = false;//ASK - is this necessary?
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT|| 'http://localhost:8000';

let topics

const Menu = () => {

    const navigation = useNavigate(); 

    /*
    const [selectedButtonCustomize, isSelectedButtonCustomize] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    */

    const getTopics = async () => {
      try {
        topics = await axios.get(`${apiEndpoint}/topics`)
        topics = topics.data
        console.log("Topics", topics)
      } catch(error) {
        console.error(error)
      }
    }

    const initiateGame = async () => {
      await getTopics()  
      //isApiCalledRef = true//ASK - is this necessary?
      navigation("/gameConfiguration", {state: {topics}})
    }

    

    

    return (
      <>
        <Nav />
        <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
          <h2>Modos de juego:</h2>
          <div className='modes'>
              <Button text = "Clásico" name="quiz" onClick={() => initiateGame()}/>
          </div>
          
        </Container>
        <Footer />
      </>
    );
}

export default Menu;
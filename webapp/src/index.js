import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  Route,
  Routes,
  MemoryRouter
  as Router
} from "react-router-dom";

import FirstGame from './components/FirstGame';
import Menu from './components/Menu';
import History from './userStats/App';
import Login from './components/Login';
import AppQuestion from './storeQuestion/App'
import Help from './help/Help';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App/>}></Route>
        <Route path="/firstGame" element={<FirstGame/>}></Route>
        <Route path="/appQuestion" element={<AppQuestion/>}></Route>
        <Route path="/menu" element={<Menu/>}></Route>
        <Route path="/history" element={<History/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/help" element={<Help/>}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


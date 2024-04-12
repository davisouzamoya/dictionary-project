import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { Header } from './componentes/header';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Header/>
    <App />
  </React.StrictMode>
);



import React from 'react';
import ReactDOM from 'react-dom';
import { inDev } from '@common/helpers';
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from '@renderer/pages/home/Home';
import 'bootstrap/dist/css/bootstrap.css';
import '../generated/tailwind.css';

// Say something
console.log('[ERWT] : Renderer execution started');

// Application to Render
const app = (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/home" element={<Home/>} />
      <Route path="/edit" element={<Home/>} />
    </Routes>
  </HashRouter>
);

// Render application in DOM
ReactDOM.render(app, document.getElementById('app'));

// Hot module replacement
if (inDev() && module.hot) module.hot.accept();

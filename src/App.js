import './App.css';
import {React, useState} from 'react';
import styled from 'styled-components';
import Banner from './components/banner.js';
import PreferenceForm from './components/preferenceForm.js';
import {setToken} from './utils/spotifyUtils';

function App() {

  //set access token on render
  setToken();

  return (
    <div className="App">
      <Banner/>
      <PreferenceForm/>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { API, Amplify, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports'
import { Helmet } from 'react-helmet'
import { tablesorter } from 'jquery';



import './App.css';
import GCSealsPage from './GCSealsPage';


Amplify.configure(awsExports)

function App() {



  return (
    <div className="App">
      <header className="App-header">
        <GCSealsPage></GCSealsPage>
      </header>
    </div>
  );
}

export default App;

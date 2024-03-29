import React, { useState, useEffect } from 'react';
import { API, Amplify, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports'
import Tabs from './components/Tabs'
import GCSealsTab from './components/GCSealsTab'
import SecondaryTomeTab from './components/SecondaryTomeTab'
import PoeticsTab from './components/PoeticsTab'
import './App.css';




Amplify.configure(awsExports)

const tabs = ['GC Seals', 'Causality Tomes', 'Poetics']

function App() {

  return (
    <div className="App">
      <header className="App-header"> XIV Profit </header>
      <div className='App-body'>
        <Tabs tabs={tabs} defaultTab="GC Seals">
          <div label={tabs[0]}>
            <GCSealsTab />
          </div>
          <div label={tabs[1]}>
            <SecondaryTomeTab />
          </div>
          <div label={tabs[2]}>
            <PoeticsTab />
          </div>
        </Tabs>
      </div>


    </div>
  );
}

export default App;

import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { API, Amplify, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports'
import Tabs from './components/Tabs'
import GCSealsTab from './components/GCSealsTab'
import SecondaryTomeTab from './components/SecondaryTomeTab'

import './App.css';
import { tab } from '@testing-library/user-event/dist/tab';


Amplify.configure(awsExports)

const tabs = ['GC Seals', 'Causality Tomes']

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Tabs tabs={tabs} defaultTab="GC Seals">
          <div label={tabs[0]}>
            <GCSealsTab />
          </div>
          <div label={tabs[1]}>
            <SecondaryTomeTab />
          </div>
        </Tabs>
      </header>
    </div>
  );
}

export default App;

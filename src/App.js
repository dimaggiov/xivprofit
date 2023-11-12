import logo from './logo.svg';
import React, {useState,useEffect} from 'react';
import {API, Amplify, graphqlOperation}  from 'aws-amplify';
import awsExports from './aws-exports'

import {listGCSealItems} from './graphql/queries'

import './App.css';


Amplify.configure(awsExports)


function App() {

  //string that contains the HTML for the table
  var tableOfItems = "<tr><th>Item</th><th>Cost</th><th>Selling Price</th><th>Gil/Seal</th><th>24hr Sales</th></tr>"

  async function getPriceForServer() //called when button is pressed
  {
    var server = document.getElementById("servers").value
    try{
     const allServersData = await API.graphql(graphqlOperation(listGCSealItems)) //get data from db
   
     //sort on cost, temporary
     allServersData.data.listGCSealItems['items'].sort((a, b) => {
      if (a['costToBuy'] < b['costToBuy']) {
        return 1;
      }
      if (a['costToBuy'] > b['costToBuy']) {
        return -1;
      }
      return 0;
    });
    
      //create table string using data from db
      allServersData.data['listGCSealItems']['items'].forEach(element => {
        tableOfItems = tableOfItems.concat('<tr>')
        tableOfItems = tableOfItems.concat('<td>', element['name'], '</td>')
        tableOfItems = tableOfItems.concat('<td>', element['costToBuy'], '</td>')
        tableOfItems = tableOfItems.concat('<td>', element[server+'MarketPrice'], '</td>')
        tableOfItems = tableOfItems.concat('<td>', element[server+'MarketPrice']/element['costToBuy'], '</td>')
        tableOfItems = tableOfItems.concat('<td>', element[server+'SalesLast24'], '</td>')
        tableOfItems = tableOfItems.concat('</tr>')
      });
      document.getElementById("pricesTable").innerHTML = tableOfItems;

    }catch(err)
    {
      console.log('error fetching data')
      console.log(err)
    }
  }


  return (
    <div className="App">
      <header className="App-header">
      <h1>GC Seal Market</h1>
        <label for="servers">Select a server:</label>
        <select id="servers" name="servers">
          <option value="adamantoise">Adamantoise</option>
          <option value="aegis">Aegis</option>
          <option value="alexander">Alexander</option>
          <option value="alpha">Alpha</option>
          <option value="anima">Anima</option>
          <option value="atomos">Atomos</option>
          <option value="bahamut">Bahamut</option>
          <option value="balmung">Balmung</option>
          <option value="behemoth">Behemoth</option>
          <option value="belias">Belias</option>
          <option value="bisarc">Bisarc</option>
          <option value="brynhildr">Brynhildr</option>
          <option value="cactuar">Cactuar</option>
          <option value="carbuncle">Carbuncle</option>
          <option value="cerberus">Cerberus</option>
          <option value="chocobo">Chocobo</option>
          <option value="coeurl">Coeurl</option>
          <option value="diabolos">Diabolos</option>
          <option value="durandal">Durandal</option>
          <option value="excalibur">Excalibur</option>
          <option value="exodus">Exodus</option>
          <option value="famfrit">Famfrit</option>
          <option value="faerie">Faerie</option>
          <option value="fenrir">Fenrir</option>
          <option value="garuda">Garuda</option>
          <option value="gilgamesh">Gilgamesh</option>
          <option value="goblin">Goblin</option>
          <option value="gungnir">Gungnir</option>
          <option value="hades">Hades</option>
          <option value="halicarnassus">Halicarnassus</option>
          <option value="hyperion">Hyperion</option>
          <option value="ifrit">Ifrit</option>
          <option value="ixion">Ixion</option>
          <option value="jenova">Jenova</option>
          <option value="kujata">Kujata</option>
          <option value="lamia">Lamia</option>
          <option value="leviathan">Leviathan</option>
          <option value="lich">Lich</option>
          <option value="louisoix">Loui</option>
          <option value="maduin">Maduin</option>
          <option value="mandragora">Mandragora</option>
          <option value="malboro">Malboro</option>
          <option value="masamune">Masamune</option>
          <option value="mateus">Mateus</option>
          <option value="midgardsormr">Midgardsormr</option>
          <option value="moogle">Moogle</option>
          <option value="odin">Odin</option>
          <option value="omega">Omega</option>
          <option value="pandaemonium">Pandaemonium</option>
          <option value="phoenix">Phoenix</option>
          <option value="phantom">Phantom</option>
          <option value="raiden">Raiden</option>
          <option value="ragnarok">Ragnarok</option>
          <option value="ramuh">Ramuh</option>
          <option value="ravana">Ravana</option>
          <option value="ridill">Ridill</option>
          <option value="sagittarius">Sagittarius</option>
          <option value="sargatanas">Sargatanas</option>
          <option value="seraph">Seraph</option>
          <option value="shinryu">Shinryu</option>
          <option value="shiva">Shiva</option>
          <option value="siren">Siren</option>
          <option value="sophia">Sophia</option>
          <option value="spriggan">Spriggan</option>
          <option value="tiamat">Tiamat</option>
          <option value="titan">Titan</option>
          <option value="tonberry">Tonberry</option>
          <option value="twintania">Twintania</option>
          <option value="typhon">Typhon</option>
          <option value="ultima">Ultima</option>
          <option value="ultros">Ultros</option>
          <option value="unicorn">Unicorn</option>
          <option value="valefor">Valefor</option>
          <option value="yojimbo">Yojimbo</option>
          <option value="zalera">Zalera</option>
          <option value="zeromus">Zeromus</option>
          <option value="zodiark">Zodiark</option>
        </select>
        <button onClick={getPriceForServer}>GetPrices</button>
        <table id="pricesTable" name ="pricesTable"></table>
      </header>

      


    </div>
  );
}

export default App;

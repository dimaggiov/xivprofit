import React from 'react'
import { listSecondaryTomeItems } from '../graphql/queries'
import { API, Amplify, graphqlOperation } from 'aws-amplify';
import '../App.css';

let secondaryTomeData = {}
let currentServer = '';

async function getSecondaryTomeData() {
    try {
        const data = await API.graphql(graphqlOperation(listSecondaryTomeItems))
        return data
    }
    catch (err) {
        console.log('error fetching data')
    }
}



//memory of if table should sort collumn ascending or decending, will swap when run
let tableSortOrder = 'asc'
//param: tells which collumn to sort by, 0 - name, 1 - cost, 2 - selling price, 3 - gil/tome, 4 - sales last 24
function sortTable(collumn) {

    switch (collumn) {
        case 0: //sort by name
            if (tableSortOrder == 'asc') {
                tableSortOrder = 'dsc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a['name'] > b['name']) {
                        return 1;
                    }
                    if (a['name'] < b['name']) {
                        return -1;
                    }
                    return 0;
                });
            }
            else {
                tableSortOrder = 'asc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a['name'] < b['name']) {
                        return 1;
                    }
                    if (a['name'] > b['name']) {
                        return -1;
                    }
                    return 0;
                });
            }
            break;


        case 1: //sort by tome price
            if (tableSortOrder == 'asc') {
                tableSortOrder = 'dsc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a['costToBuy'] > b['costToBuy']) {
                        return 1;
                    }
                    if (a['costToBuy'] < b['costToBuy']) {
                        return -1;
                    }
                    return 0;
                });
            }
            else {
                tableSortOrder = 'asc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a['costToBuy'] < b['costToBuy']) {
                        return 1;
                    }
                    if (a['costToBuy'] > b['costToBuy']) {
                        return -1;
                    }
                    return 0;
                });
            }
            break;
        case 2: //sort by MarketPrice
            if (tableSortOrder == 'asc') {
                tableSortOrder = 'dsc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a[currentServer + 'MarketPrice'] > b[currentServer + 'MarketPrice']) {
                        return 1;
                    }
                    if (a[currentServer + 'MarketPrice'] < b[currentServer + 'MarketPrice']) {
                        return -1;
                    }
                    return 0;
                });
            }
            else {
                tableSortOrder = 'asc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a[currentServer + 'MarketPrice'] < b[currentServer + 'MarketPrice']) {
                        return 1;
                    }
                    if (a[currentServer + 'MarketPrice'] > b[currentServer + 'MarketPrice']) {
                        return -1;
                    }
                    return 0;
                });
            }
            break;
        case 3: //sort by gil/tome
            if (tableSortOrder == 'asc') {
                tableSortOrder = 'dsc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a[currentServer + 'MarketPrice'] / a['costToBuy'] > b[currentServer + 'MarketPrice'] / b['costToBuy']) {
                        return 1;
                    }
                    if (a[currentServer + 'MarketPrice'] / a['costToBuy'] < b[currentServer + 'MarketPrice'] / b['costToBuy']) {
                        return -1;
                    }
                    return 0;
                });
            }
            else {
                tableSortOrder = 'asc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a[currentServer + 'MarketPrice'] / a['costToBuy'] < b[currentServer + 'MarketPrice'] / b['costToBuy']) {
                        return 1;
                    }
                    if (a[currentServer + 'MarketPrice'] / a['costToBuy'] > b[currentServer + 'MarketPrice'] / b['costToBuy']) {
                        return -1;
                    }
                    return 0;
                });

            }
            break;
        case 4: //sort by sales last 24
            if (tableSortOrder == 'asc') {
                tableSortOrder = 'dsc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a[currentServer + 'SalesLast24'] > b[currentServer + 'SalesLast24']) {
                        return 1;
                    }
                    if (a[currentServer + 'SalesLast24'] < b[currentServer + 'SalesLast24']) {
                        return -1;
                    }
                    return 0;
                });
            }
            else {
                tableSortOrder = 'asc'
                secondaryTomeData.data.listSecondaryTomeItems['items'].sort((a, b) => {
                    if (a[currentServer + 'SalesLast24'] < b[currentServer + 'SalesLast24']) {
                        return 1;
                    }
                    if (a[currentServer + 'SalesLast24'] > b[currentServer + 'SalesLast24']) {
                        return -1;
                    }
                    return 0;
                });
            }
            break;
    }

    buildTable()

}

function buildTable() {
    var tableOfItems = ''
    secondaryTomeData.data['listSecondaryTomeItems']['items'].forEach(element => {
        tableOfItems = tableOfItems.concat('<tr>')
        tableOfItems = tableOfItems.concat('<td>', element['name'], '</td>')
        tableOfItems = tableOfItems.concat('<td>', element['costToBuy'], '</td>')
        tableOfItems = tableOfItems.concat('<td>', element[currentServer + 'MarketPrice'], '</td>')
        tableOfItems = tableOfItems.concat('<td>', (element[currentServer + 'MarketPrice'] / element['costToBuy']).toFixed(2), '</td>')
        tableOfItems = tableOfItems.concat('<td>', element[currentServer + 'SalesLast24'], '</td>')
        tableOfItems = tableOfItems.concat('</tr>')
    });
    document.getElementById("pricesTableBody").innerHTML = tableOfItems;
}


function getPriceForServer() //called when button is pressed
{
    document.getElementById("sealsTHead").style = { display: 'block' }
    currentServer = document.getElementById("servers").value;
    sortTable(2)// sort table by price, also creates table

}


const SecondaryTomeTab = () => {


   
    let getAllServersData = () => {
        return new Promise((resolve, reject) => {
            resolve(getSecondaryTomeData());
        });
    }
    getAllServersData().then((result) => {
        secondaryTomeData = result
    })


    return (
        <>
            <h1>Causality Tomes</h1>
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
                <option value="bismarck">Bismarck</option>
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
            <table className="generalTable" id="pricesTable" name="pricesTable">
                <thead id="sealsTHead" style={{ display: 'none' }}>
                    <tr>
                        <th onClick={() => sortTable(0)}>Item</th>
                        <th onClick={() => sortTable(1)}>Cost</th>
                        <th onClick={() => sortTable(2)}>Selling Price</th>
                        <th onClick={() => sortTable(3)}>Gil/Tome</th>
                        <th onClick={() => sortTable(4)}>24hr Sales</th>
                    </tr>
                </thead>
                <tbody id="pricesTableBody"></tbody>
            </table>
        </>);
}

export default SecondaryTomeTab;
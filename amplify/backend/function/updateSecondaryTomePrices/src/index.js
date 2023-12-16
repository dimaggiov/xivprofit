/* Amplify Params - DO NOT EDIT
    API_XIVPROFIT_GCSEALITEMSTABLE_ARN
    API_XIVPROFIT_GCSEALITEMSTABLE_NAME
    API_XIVPROFIT_GRAPHQLAPIENDPOINTOUTPUT
    API_XIVPROFIT_GRAPHQLAPIIDOUTPUT
    API_XIVPROFIT_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */
//t
const fetch = require("node-fetch")
const https = require("https");
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
const tableName = 'SecondaryTomeItems-kt4hypvgp5huziaubdk2oupe24-dev'


async function updateSecondaryTomeItems(servers, items) {
    
    let updateExpressions = {}
    let expressionAttributes = {}
    
    for (const server of servers) {

        //call api and parse json response
        const pricesUrl = 'https://universalis.app/api/v2/' + server + '/' + items + '/?entries=1'
        const salesUrl = 'https://universalis.app/api/v2/history/' + server + '/' + items + '/?entriesWithin=86400'
        const pricesResponse = await fetch(pricesUrl, { method: 'GET' })
        const pricesJson = await pricesResponse.json()
        const salesResponse = await fetch(salesUrl, { method: 'GET' })
        const salesJson = await salesResponse.json()


        try {//try to parse items into updateExpression and expressionAttribute for DynamoDB
            for (const item of pricesJson['itemIDs']) {
                if (!(item in updateExpressions)) {
                    updateExpressions[item] = 'set '
                }
                if (!(item in expressionAttributes)) {
                    expressionAttributes[item] = {}
                }

                try {
                    const price = pricesJson['items'][''.concat(item)]['minPrice']
                    const last24 = salesJson['items'][''.concat(item)]['entries'].length

                    let serverPriceStr = ':' + server + 'marketPrice'
                    let serverLast24Str = ':' + server + 'salesLast24'

                    expressionAttributes[item][serverPriceStr] = price
                    expressionAttributes[item][serverLast24Str] = last24
                    updateExpressions[item] += server + 'MarketPrice = :' + server + 'marketPrice, ' + server + 'SalesLast24 = :' + server + 'salesLast24, '

                }
                catch (err) {
                    let serverPriceStr = ':' + server + 'marketPrice'
                    let serverLast24Str = ':' + server + 'salesLast24'
                    expressionAttributes[item][serverPriceStr] = 0
                    expressionAttributes[item][serverLast24Str] = 0

                    updateExpressions[item] += server + 'MarketPrice = :' + server + 'marketPrice, ' + server + 'SalesLast24 = :' + server + 'salesLast24, '

                    console.log('item not found, setting to 0:', item)
                    console.log(err)
                }
            }
        }
        catch (err) {
            console.log("bad data from universalis for server:", server, "skipping server...")
            console.log(err)
        }

    }

    //take created expressionAtributes and update expression to create param and insert into db
    for (const [id, atrib] of Object.entries(expressionAttributes)) {
        const expr = updateExpressions[id].substring(0, updateExpressions[id].length - 2)
        const params = await { TableName: tableName, Key: { id: id }, UpdateExpression: expr, ExpressionAttributeValues: atrib }
        try {
            await ddb.update(params).promise()
        }
        catch (err) {
            console.log('error writing to db')
            console.log(err)
        }
    }

}


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const itemIDSstr = '36221,39715,37826,39716,36220,37823,39713,37827,36218,37828,36222,37825,39712,36219,39714,39711'
   
   //split lists into 2 for smaller writes, one fullsize write does not fit
    const servers1 = ['adamantoise', 'cactuar', 'faerie', 'gilgamesh', 'jenova', 'midgardsormr', 'sargatanas', 'siren', 'balmung', 'brynhildr', 'coeurl', 'diabolos', 'goblin', 'malboro', 'mateus', 'zalera', 'behemoth', 'excalibur', 'exodus', 'famfrit', 'hyperion', 'lamia', 'leviathan', 'ultros', 'halicarnassus', 'maduin', 'marilith', 'seraph', 'cerberus', 'louisoix', 'moogle', 'omega', 'phantom', 'ragnarok', 'sagittarius', 'spriggan', 'alpha', 'lich', 'odin', 'phoenix']
    const servers2 = ['raiden', 'shiva', 'twintania', 'zodiark', 'aegis', 'atomos', 'carbuncle', 'garuda', 'gungnir', 'kujata', 'tonberry', 'typhon', 'alexander', 'bahamut', 'durandal', 'fenrir', 'ifrit', 'ridill', 'tiamat', 'ultima', 'anima', 'asura', 'chocobo', 'hades', 'ixion', 'masamune', 'pandaemonium', 'titan', 'belias', 'mandragora', 'ramuh', 'shinryu', 'unicorn', 'valefor', 'yojimbo', 'zeromus', 'bismarck', 'ravana', 'sephirot', 'sophia', 'zurvan']
  
    await updateSecondaryTomeItems(servers1, itemIDSstr)
    await updateSecondaryTomeItems(servers2, itemIDSstr)

    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify('items updated'),
    };
};

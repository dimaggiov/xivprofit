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
const fetch  = require("node-fetch")
const https = require("https");
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
const tableName = 'GCSealItems-kt4hypvgp5huziaubdk2oupe24-dev'


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const itemIDSstr = '9371,5357,5530,6151,6153,5274,5558,9357,5531,7598,13595,7601,7597,13589,5501,5119,5532,7596,5261,7599,9370,15649,9369,9356,7602,7600,7603,13591,9368,5502,7604,6154,9372,9366,9367,13593,7605,7806,5358'
    const servers = ['adamantoise','cactuar','faerie','gilgamesh','jenova','midgardsormr','sargatanas','siren','balmung','brynhildr','coeurl','diabolos','goblin','malboro','mateus','zalera','behemoth','excalibur','exodus','famfrit','hyperion','lamia','leviathan','ultros','halicarnassus','maduin','marilith','seraph','cerberus','louisoix','moogle','omega','phantom','ragnarok','sagittarius','spriggan','alpha','lich','odin','phoenix','raiden','shiva','twintania','zodiark','aegis','atomos','carbuncle','garuda','gungnir','kujata','tonberry','typhon','alexander','bahamut','durandal','fenrir','ifrit','ridill','tiamat','ultima','anima','asura','chocobo','hades','ixion','masamune','pandaemonium','titan','belias','mandragora','ramuh','shinryu','unicorn','valefor','yojimbo','zeromus','bisarc','ravana','sephirot','sophia','zurvan'];
    
    //objects to create the update parameters
    let updateExpressions = {}
    let expressionAttributes = {}

     for(const server of servers){
        //call api and get json response
        const pricesUrl = 'https://universalis.app/api/v2/'+server+'/'+itemIDSstr+'/?entries=1'
        const salesUrl = 'https://universalis.app/api/v2/history/'+server+'/'+itemIDSstr+'/?entriesWithin=86400'
        const pricesResponse = await fetch(pricesUrl, {method: 'GET'})//'https://universalis.app/api/v2/'+server+'/'+itemIDSstr+'/?entries=1',
        const pricesJson = await pricesResponse.json()
        const salesResponse = await fetch(salesUrl, {method: 'GET'})//'https://universalis.app/api/v2/'+server+'/'+itemIDSstr+'/?entries=1',
        const salesJson = await salesResponse.json()

    
        for(const item of pricesJson['itemIDs'])
        {
            if(!(item in updateExpressions)){
                updateExpressions[item] = 'set ' 
            }
            if(!(item in expressionAttributes)){
                expressionAttributes[item] = {}
            }

            try{
            const price = pricesJson['items'][''.concat(item)]['minPrice']
            const last24 = salesJson['items'][''.concat(item)]['entries'].length
                 
            let serverPriceStr = ':' + server + 'marketPrice'
            let serverLast24Str = ':' + server + 'salesLast24'

             expressionAttributes[item][serverPriceStr] = price
             expressionAttributes[item][serverLast24Str] = last24
             updateExpressions[item] += server +'MarketPrice = :'+server+'marketPrice, ' + server +'SalesLast24 = :'+server+'salesLast24, '
            
            }
            catch(err)
            {
                let serverPriceStr = ':' + server + 'marketPrice'
                let serverLast24Str = ':' + server + 'salesLast24'
                expressionAttributes[item] = {serverPriceStr: 0, serverLast24Str: 0}
            
                updateExpressions[item] += server +'MarketPrice = :'+server+'marketPrice, ' + server +'SalesLast24 = :'+server+'salesLast24, '

                console.log('item not found, setting to 0:', item)
                console.log(err)
            }
        }
    
    }


    for(const [id, atrib] of Object.entries(expressionAttributes))
    {
        const expr = updateExpressions[id].substring(0,updateExpressions[id].length-2)
        const params = await {TableName: tableName, Key: {id: id}, UpdateExpression: expr, ExpressionAttributeValues: atrib, ReturnValues: 'UPDATED_NEW'}
        await ddb.update(params).promise()

    }

     return  {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify('items updated'),
    };
};

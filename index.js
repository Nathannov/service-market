global.config = require("./configurations/config.json");
global.mongodb = require("./helpers/mongodb.js");
const _Binance = require('node-binance-api');
const binance = new _Binance();
const markettableList = require('./dao/marketable_list');
let inside = false;

const sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const timeToCallMarket = async () => {

    let initialSecond = new Date().getSeconds();

    if (initialSecond <= 5 || (initialSecond >= 30 && initialSecond <= 35)) {
        inside = false;

        const marketables = await markettableList.getAllActualMarketable();
        console.log(marketables);
        binanceSaveMarketWithSocket(marketables);
        stopSocket();
    }
    else {
        //calculate time to sleep
        let timeToSleep = 0;
        if (initialSecond > 5 && initialSecond < 30)
            timeToSleep = 31 - initialSecond;
        else timeToSleep = 61 - initialSecond;

        await sleep(timeToSleep * 1000);
        timeToCallMarket();
    }
};

async function binanceSaveMarketWithSocket(marketables) {
    console.info(new Date().toISOString(), "Start BinanceSaveMarketWithSocket BNNC...");
    let saveTemporalPairsBNNC = [];

    binance.websockets.prevDay(marketables, async (err, summary) => {

        if (err) return;
        if (saveTemporalPairsBNNC.indexOf(summary.symbol) === -1) {

            saveTemporalPairsBNNC.push(summary.symbol);
            let date_created = new Date();
            let percent = parseFloat(summary.percentChange).toFixed(2);
            let currentData = {
                broker: 3,
                name: summary.symbol,
                bid: summary.bestBid,
                last: summary.close,
                ask: summary.bestAsk,
                high24hr: summary.high,
                low24hr: summary.low,
                volume: summary.quoteVolume,
                mod: 0,
                date_created: date_created,
                percent: percent,
            };

            await global.mongodb.saveItem("market", currentData);
        }

        if (marketables.length === saveTemporalPairsBNNC.length && !inside) {
            inside = true;
            await sleep(15000);
            inside = false;
            saveTemporalPairsBNNC = [];
        }
    });
}

async function stopSocket() {

    await sleep(60000 * 30); //sleep 30 minutes
    let endpoints = binance.websockets.subscriptions();
    for (let endpoint in endpoints) {
        binance.websockets.terminate(endpoint);
    }

    console.info(new Date().toISOString(), "End BinanceSaveMarketWithSocket BNNC...");
    await sleep(30000);
    timeToCallMarket();
}

(async () => {
    await sleep(3000);
    timeToCallMarket();
})();
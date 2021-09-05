global.config = require("./configurations/config.json");
global.mongodb = require("./helpers/mongodb.js");
const _Binance = require('node-binance-api');
const binance = new _Binance();
const markettableList = require('./dao/marketable_list');
let second_initial = 0,
    second_counter = 0,
    inside = false,
    date_created;

const sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const timeToCallMarket = async () => {

    date_created = new Date();
    let initialSecond = date_created.getSeconds();
    if (initialSecond <= 3)
        binanceSaveMarketWithSocket();
    else {
        await sleep(1000);
        timeToCallMarket();
    }
};

async function binanceSaveMarketWithSocket() {

    console.info("Start BinanceSaveMarketWithSocket BNNC...");
    const marketables = await markettableList.getAllActualMarketable();
    let saveTemporalPairsBNNC = [];

    binance.websockets.prevDay(marketables, async (err, summary) => {

        if (err) return;
        date_created = new Date();

        if (saveTemporalPairsBNNC.indexOf(summary.symbol) === -1) {

            saveTemporalPairsBNNC.push(summary.symbol);
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
            second_initial = date_created.getSeconds();
        }

        if ((second_counter - second_initial) === 7) {
            inside = false,
                second_initial = 0,
                second_counter = 0,
                saveTemporalPairsBNNC = [];
        }

        second_counter = date_created.getSeconds();
    });

    await sleep(46000);
    let endpoints = binance.websockets.subscriptions();
    for (let endpoint in endpoints) {
        console.log(endpoint);
        binance.websockets.terminate(endpoint);
    }

    console.info("End BinanceSaveMarketWithSocket BNNC...");
    await sleep(10000);
    inside = false,
        second_initial = 0,
        second_counter = 0;
    timeToCallMarket();
}

timeToCallMarket();
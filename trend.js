const Binance = require('binance-api-node').default;
const { Telegraf } = require('telegraf');
const apiKey = "API_KEY";
const apiSecret = "API_SECRET";
const client = Binance({
    apiKey: apiKey,
    apiSecret: apiSecret
  })
const TELEGRAM_API_KEY = "TELEGRAM_API_KEY";
const TELEGRAM_GROUP_ID = 'TELEGRAM_GROUP_ID';
const bot = new Telegraf(TELEGRAM_API_KEY);
const symbols = [
    "BTCUSDT","ETHUSDT","BCHUSDT","XRPUSDT","EOSUSDT","LTCUSDT","TRXUSDT","ETCUSDT","LINKUSDT","XLMUSDT","ADAUSDT","XMRUSDT","DASHUSDT",
    "ZECUSDT","XTZUSDT","BNBUSDT","ATOMUSDT","ONTUSDT","IOTAUSDT","BATUSDT","VETUSDT","NEOUSDT","QTUMUSDT","IOSTUSDT","THETAUSDT",
    "ALGOUSDT","ZILUSDT","KNCUSDT","ZRXUSDT","COMPUSDT","OMGUSDT","DOGEUSDT","SXPUSDT","KAVAUSDT","BANDUSDT","RLCUSDT","WAVESUSDT",
    "MKRUSDT",  "SNXUSDT","DOTUSDT","DEFIUSDT","YFIUSDT","BALUSDT","CRVUSDT","TRBUSDT","RUNEUSDT",  "SUSHIUSDT", "SRMUSDT","EGLDUSDT",
    "SOLUSDT","ICXUSDT","STORJUSDT","BLZUSDT","UNIUSDT","AVAXUSDT","FTMUSDT","HNTUSDT","ENJUSDT","FLMUSDT","TOMOUSDT","RENUSDT","KSMUSDT",
    "NEARUSDT","AAVEUSDT","FILUSDT","RSRUSDT","LRCUSDT","MATICUSDT","OCEANUSDT","CVCUSDT","BELUSDT","CTKUSDT","AXSUSDT","ALPHAUSDT",
    "ZENUSDT",
    "SKLUSDT",
    "GRTUSDT",
    "1INCHUSDT",
    "CHZUSDT",
    "SANDUSDT",
    "ANKRUSDT",
    "BTSUSDT",
    "LITUSDT",
    "UNFIUSDT",
    "REEFUSDT",
    "RVNUSDT",
    "SFPUSDT",
    "XEMUSDT",
    "BTCSTUSDT",
    "COTIUSDT",
    "CHRUSDT",
    "MANAUSDT",
    "ALICEUSDT",
    "HBARUSDT",
    "ONEUSDT",
    "LINAUSDT",
    "STMXUSDT",
    "DENTUSDT",
    "CELRUSDT",
    "HOTUSDT",
    "MTLUSDT",
    "OGNUSDT",
    "NKNUSDT",
    "SCUSDT",
    "DGBUSDT",
    "1000SHIBUSDT",
    "BAKEUSDT",
    "GTCUSDT",
    "BTCDOMUSDT",
    "TLMUSDT",
    "IOTXUSDT",
    "AUDIOUSDT",
    "RAYUSDT",
    "C98USDT",
    "MASKUSDT",
    "ATAUSDT",
    "DYDXUSDT",
    "1000XECUSDT",
    "GALAUSDT",
    "CELOUSDT",
    "ARUSDT",
    "KLAYUSDT",
    "ARPAUSDT",
    "CTSIUSDT",
    "LPTUSDT",
    "ENSUSDT",
    "PEOPLEUSDT",
    "ANTUSDT",
    "ROSEUSDT",
    "DUSKUSDT",
    "FLOWUSDT",
    "IMXUSDT",
    "API3USDT",
    "GMTUSDT",
    "APEUSDT",
    "WOOUSDT",
    "FTTUSDT",
    "JASMYUSDT",
    "DARUSDT",
    "GALUSDT",
    "OPUSDT",
    "INJUSDT",
    "STGUSDT",
    "FOOTBALLUSDT",
    "SPELLUSDT",
    "1000LUNCUSDT",
    "LUNA2USDT",
    "LDOUSDT",
    "CVXUSDT",
    "ICPUSDT",
    "APTUSDT",
    "QNTUSDT",
    "BLUEBIRDUSDT",
  
    "FETUSDT",
    "FXSUSDT",
    "HOOKUSDT",
    "MAGICUSDT",
    "TUSDT",
    "RNDRUSDT",
    "HIGHUSDT",
    "MINAUSDT",
    "ASTRUSDT",
    "AGIXUSDT",
    "PHBUSDT",
    "GMXUSDT",
    "CFXUSDT",
    "STXUSDT",
    "COCOSUSDT",
    "BNXUSDT",
    "ACHUSDT",
    "SSVUSDT",
    "CKBUSDT",
    "PERPUSDT",
    "TRUUSDT",
    "LQTYUSDT",
    "USDCUSDT",
    "IDUSDT",
    "ARBUSDT"
  ]
/////////////////////BURASI ÇOKOMELLİ////////////////////////
const fixedRisk = 0.1; // x dolar sabit risk
////////////////////////////////////////////////////////////
const rR = 1
////////////////////////////////////////////////////////////
const maxOpenTrades = 2;
///////////////////////////////////////////////////////////
const timeperiod = '5m';
const limit = 100;
const period = 10;  // Bu değeri ihtiyacınıza göre ayarlayabilirsiniz

async function getKlines(symbol, interval = timeperiod, limit = 100) {
    const klines = await client.futuresCandles({ symbol, interval, limit });
    return klines;
}



function findPivotPointsV3(highs, lows, period) {
    const pivotHighs = [];
    const pivotLows = [];
  
    for (let i = period; i < highs.length - period; i++) {
      const leftHighs = highs.slice(i - period, i);
      const rightHighs = highs.slice(i + 1, i + period + 1);
      const leftLows = lows.slice(i - period, i);
      const rightLows = lows.slice(i + 1, i + period + 1);
  
      const highestLeftHigh = Math.max(...leftHighs);
      const highestRightHigh = Math.max(...rightHighs);
      const lowestLeftLow = Math.min(...leftLows);
      const lowestRightLow = Math.min(...rightLows);
  
      const isPivotHigh = highs[i] > highestLeftHigh && highs[i] > highestRightHigh;
      const isPivotLow = lows[i] < lowestLeftLow && lows[i] < lowestRightLow;
  
      if (isPivotHigh) {
        pivotHighs.push({ index: i, value: highs[i] });
      }
      if (isPivotLow) {
        pivotLows.push({ index: i, value: lows[i] });
      }
    }
  
    return { pivotHighs, pivotLows };
  }
function calculateSlope(point1, point2) {
    return (point2.value - point1.value) / (point2.index - point1.index);
}

function calculateTrendLine(pivot1, pivot2) {
    let slope = calculateSlope(pivot1, pivot2);
    let intercept = pivot1.value - slope * pivot1.index;
    return { slope, intercept };
}
async function processSymbols(symbols) {
    const promises = symbols.map(symbol => run(symbol));
    await Promise.all(promises);
}

function calculateTrendValueAtLastIndex(trendLine, lastIndex) {
    return trendLine.slope * lastIndex + trendLine.intercept;
}
async function run(symbol) {
    const klines = await getKlines(symbol, timeperiod, limit);
    const volume = klines.map(data => parseFloat(data.volume));
    const open = klines.map(data => parseFloat(data.open));
    const high = klines.map(data => parseFloat(data.high));
    const low = klines.map(data => parseFloat(data.low));
    const close = klines.map(data => parseFloat(data.close));
    const lastClosePrice = close[close.length - 1];
    const lastClose2 = close[close.length - 2];
    const hacim = volume[volume.length-1]
    const averageVolume = calculateAverageVolume(volume);
    const positions = await client.futuresPositionRisk();    
    let   positionAmt = positions.filter(position => Number(position.positionAmt) !== 0).length
    const exchangeInfo = await client.futuresExchangeInfo();
    const symbolInfo = exchangeInfo.symbols.find((s) => s.symbol === symbol);
    const quantityPrecision = symbolInfo.quantityPrecision;
    const pricePrecision = symbolInfo.pricePrecision;
    
    const { pivotHighs, pivotLows } = findPivotPointsV3(high, low, period);
    const lastPivotHigh = pivotHighs[pivotHighs.length - 1];
    const lastPivotLow = pivotLows[pivotLows.length - 1];

    
    if (pivotHighs.length >= 2) {
        let lastPivotHighs = pivotHighs.slice(-2);
        let lastPivotLows = pivotLows.slice(-2);
        let trendLineHigh = calculateTrendLine(lastPivotHighs[0], lastPivotHighs[1]);
        let highTrend = calculateTrendValueAtLastIndex(trendLineHigh, close.length - 1);
        const slPrice = (lastPivotLow.value * 0.999).toFixed(pricePrecision);
        const risk = lastClosePrice - slPrice;
        const tpPrice = (lastClosePrice + (risk * rR)).toFixed(pricePrecision);
        const positionSize = (fixedRisk / risk).toFixed(quantityPrecision);
        const deger = (positionSize*lastClosePrice).toFixed(2);
        
        if (lastClosePrice > highTrend && hacim>averageVolume&& lastClose2 < highTrend) {
            const message =` ${symbol}===> Trend Yukarı Kırıldı \nGİRİŞ FİYATI===> ${lastClosePrice}\nSTOP NOKTASI===> ${slPrice},\nTP NOKTASI===> ${tpPrice},\nPoz Büyüklüğü ===>${deger}`; 
            console.log(message); 
            bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message);
            recordTrade(symbol, lastClosePrice, tpPrice, slPrice, deger,yon);
        }
    }

    if (pivotLows.length >= 2) {
        const slPriceMinus = (lastPivotHigh.value * 1.001).toFixed(pricePrecision);
        const riskshort =  slPriceMinus-lastClosePrice ;
        const tpPriceMinus = (lastClosePrice - (riskshort * rR)).toFixed(pricePrecision);
        const positionSize = (fixedRisk / riskshort).toFixed(quantityPrecision);
        const deger = (positionSize*lastClosePrice).toFixed(2)
        let lastPivotLows = pivotLows.slice(-2);
        let trendLineLow = calculateTrendLine(lastPivotLows[0], lastPivotLows[1]);
        let lowTrend = calculateTrendValueAtLastIndex(trendLineLow, close.length - 1);
        if (lastClosePrice < lowTrend && hacim>averageVolume && lastClose2 > lowTrend) {
            const message =` ${symbol}===> Trend Aşağı Kırıldı \nGİRİŞ FİYATI===> ${lastClosePrice}\nSTOP NOKTASI===> ${slPriceMinus},\nTP NOKTASI===> ${tpPriceMinus},\nPoz Büyüklüğü ===>${deger}`; 
                console.log(message);
                bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message);
        }
    }


}

const runProcessSymbols = async () => {
    try {
      await processSymbols(symbols);
    } catch (error) {
      console.error(error);
    }
  };
  
  setInterval(runProcessSymbols, 1000 * 60 * 5); // 5 dakika
  
import {extrem} from './function-analyzer';

export default evaluateVerhulst;

/**
 * Evaluates interpolating Verhulst logistic curve up to forecast end
 *
 * @param {Array} functionValuesN             set of population values
 * @param {Array} functionValuesDN            set of daily grow of population values based on smoothing data
 * @param {Array} realDN                      set of daily grow of population values based on statistic data
 * @param {Number} wholePopulation            amount of whole population
 * @returns {Object}                          interpolating Verhulst logistic curve
 */
function evaluateVerhulst(functionValuesN, functionValuesDN, realDN, wholePopulation) {
  let result = {};

  // analyze the smoothing data
  const analyzedExtremSmoothing = extrem(functionValuesDN);
  let maxSmoothing = analyzedExtremSmoothing.max;
  let maxXSmoothing = analyzedExtremSmoothing.index;
  let startIndex = analyzedExtremSmoothing.startIndex;

  // analyze real data from statistics
  const analyzedExtremReal = extrem(realDN);
  let maxReal = analyzedExtremReal.max;
  let maxXReal = analyzedExtremReal.index;

  let max = (maxReal > maxSmoothing)? maxReal : maxSmoothing;
  let maxX = (maxReal > maxSmoothing)? maxXReal : maxXSmoothing;
  console.log('evaluateVerhulst() max = ' + max + '; maxX = ' + maxX);
  console.log('evaluateVerhulst() N_in_max = ' + functionValuesN[maxX] );

  // very important to know: is maximum of daily infected already reached?
  const isMax = ( max !== null );

  // estimated maximum infected people
  let M;

  const r0 = getR0(startIndex, isMax, maxX, functionValuesN);
  const lastX = functionValuesN.length - 1;
  const lastN = functionValuesN[functionValuesN.length - 1];

  if (isMax) {
    M = functionValuesN[maxX] * 2;
    console.log('evaluateVerhulst() doubled M = ' + M + ', lastN = ' + lastN);
    if (M < lastN) {
      M = Math.round(lastN * 1.05);
      console.log('evaluateVerhulst() M = ' + M + ', lastN = ' + lastN);
    }
  } else if (wholePopulation !== null) {
    // estimated value (done through many european countries): 0.25% of population will be in infected statistics
    M = Math.round(wholePopulation * 0.0025);
  } else {
    const distanceToStart = lastX - startIndex;
    const middleEpedemyTimeToExtrem = 30;
    let factorToTop = distanceToStart / middleEpedemyTimeToExtrem;
    factorToTop = (factorToTop > 1.0)? factorToTop = 0.9 : factorToTop;
    M = Math.round(functionValuesN[functionValuesN.length - 1] / factorToTop) * 2;
  }
  console.log('evaluateVerhulst() M = ' + M);

  // Last days in statistics using in calculating the last growth parameter R
  const DAYS_FOR_LAST_R = 7;
  const startXforR = (lastX > DAYS_FOR_LAST_R) ? lastX - DAYS_FOR_LAST_R : 0;
  // Growth parameter R for last days in statistics
  const rLast = getAverageR(startXforR, lastX, M, functionValuesN);
  console.log('evaluateVerhulst() rLast = ' + rLast);

  // array to store calculated daily infected people for each day
  let arrayForecastDN = [];
  // array to store calculated total infected people for each day
  let arrayForecastN = [];
  // total infected people for each day
  let N = functionValuesN[functionValuesN.length - 1];
  // daily infected people for each day
  let dN = functionValuesDN[functionValuesDN.length - 1];
  // counter for amount of forecast days
  let amount = 0;
  // if a day of "zero new daily infected" will be not found => the parameter will limit the forecast days
  const MAX_FORECAST_PERIOD_DAYS = 120;

  // let's calculate Verhulst forecast
  console.log('evaluateVerhulst() dN = ' + dN + '; N = ' + N + '; amount = ' + amount);
  while (dN > 0 && amount < MAX_FORECAST_PERIOD_DAYS) {
    dN = getDailyDelta(rLast, N, M);
    N += dN;
    arrayForecastDN.push(dN);
    arrayForecastN.push(N);
    amount++;
    console.log('evaluateVerhulst() dN = ' + dN + '; N = ' + N + '; amount = ' + amount);
  }

  // is a day of "zero new daily infected" found?
  const reached0 = (dN === 0 || dN < 0);
  // whole data: statistics + forecast
  let arrayN = functionValuesN.slice().concat(arrayForecastN);
  let arrayDN = functionValuesDN.slice().concat(arrayForecastDN);

  // put results together into object
  result['arrayForecastDN'] = arrayForecastDN;
  result['arrayForecastN'] = arrayForecastN;
  result['arrayN'] = arrayN;
  result['arrayDN'] = arrayDN;
  result['M'] = M;
  result['rLast'] = rLast;
  result['max'] = max;
  result['maxX'] = maxX;
  result['startIndex'] = startIndex;
  result['reached0'] = reached0;

  return result;
}

/**
 * Get daily delta ∆N = rN(1 - N/M)
 *
 * @param {Number} r      the logistic growth rate (growth speed)
 * @param {Number} N      population value
 * @param {Number} M      population possible maximum
 * @returns {Number}      daily grow of population
 */
function getDailyDelta(r, N, M) {
  let result = 0;
  try {
    result = Math.round(r * N * (1 - (N / M)));
  } catch (err) {
    console.log('getDailyDelta() r = ' + r + '; N = ' + N + '; M = ' + M);
    console.log('getDailyDelta() error: ' + err.message);
  }

  return result;
}


/**
 * Get logistic growth rate r= ∆N / (N(1 - N/M))
 *
 * @param {Number} dN     daily grow of population
 * @param {Number} N      population value
 * @param {Number} M      population possible maximum
 * @returns {Number}      the logistic growth rate (growth speed)
 */
function getGrowthRate(dN, N, M) {
  let result = 0.0;
  try {
    result = dN / ( N * (1 - (N / M)));
  } catch (err) {
    console.log('getGrowthRate() dN = ' + dN + '; N = ' + N + '; M = ' + M);
    console.log('getGrowthRate() error: ' + err.message);
  }

  return result;
}

/**
 * get r0= ∆N / N , only within 1/3 from start to top (1 - N/M) -> 1
 *
 * @param startIndex      starting X where N going to up
 * @param isMax           is maximum of N available
 * @param maxX            x where N has maximum
 * @param functionValuesN array of N
 * @returns {Number}      r0
 */
function getR0(startIndex, isMax, maxX, functionValuesN) {
  let indexOnRight = startIndex;

  if (isMax) {
    indexOnRight = Math.round((maxX - startIndex ) / 3);
  } else {
    const lastX = functionValuesN.length - 1;
    const distanceToStart = lastX - startIndex;
    if (distanceToStart <= 10) {
      indexOnRight = lastX;
    } else if (distanceToStart <= 30) {
      indexOnRight = startIndex + 10;
    } else {
      const offset =  Math.round((distanceToStart ) / 3);
      indexOnRight = startIndex + offset;
    }
  }

  return calculateR0(startIndex, indexOnRight, functionValuesN);
}

/**
 * get r0= ∆N / N , only within 1/3 from start to top (1 - N/M) -> 1
 *
 * @param startIndex      starting X where N going to up
 * @param endIndex        end X where 1/3 to top
 * @param functionValuesN array of N
 * @returns {Number}      r0
 */
function calculateR0(startIndex, endIndex, functionValuesN) {
  let result = 0.0;
  let sumR = 0.0;
  let amount = 0;

  for (let i = startIndex; i <= endIndex; i++) {
    let N = functionValuesN[i];
    let dN = Math.abs(N - functionValuesN[i-1]);
    sumR += (N !== 0)? dN / N : 0;
    amount++;
  }

  if (amount > 0) {
    result = sumR / amount;
  }

  return result;
}

/**
 * get average of r = ∆N / N(1 - N/M)
 *
 * @param startIndex      starting X where N going to up
 * @param endIndex        end X where 1/3 to top
 * @param M               value of M (maximum of infected people)
 * @param functionValuesN array of N (total infected for each day)
 * @returns {Number}      r
 */
function getAverageR(startIndex, endIndex, M, functionValuesN) {
  let result = 0.0;
  let sumR = 0.0;
  let amount = 0;

  for (let i = startIndex; i <= endIndex; i++) {
    let N = functionValuesN[i];
    let dN = Math.abs(N - functionValuesN[i-1]);
    sumR += getGrowthRate(dN, N, M);
    amount++;
  }

  if (amount > 0) {
    result = sumR / amount;
  }

  return result;
}

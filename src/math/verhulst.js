import {extrem} from './function-analyzer';

export default evaluateVerhulst;

/**
 * Evaluates interpolating Verhulst logistic curve up to forecast end
 *
 * @param {Array} functionValuesN             set of population values
 * @param {Array} functionValuesDN            set of daily grow of population values based on smoothing data
 * @param {Array} realDN                      set of daily grow of population values based on statistic data
 * @param {Number} wholePopulation            amount of whole population
 * @returns {Array}                           interpolating Verhulst logistic curve
 */
function evaluateVerhulst(functionValuesN, functionValuesDN, realDN, wholePopulation) {
  let result = {};

  const analyzedExtrem1 = extrem(functionValuesDN);
  let max1 = analyzedExtrem1.max;
  let maxX1 = analyzedExtrem1.index;
  let startIndex = analyzedExtrem1.startIndex;

  const analyzedExtremReal = extrem(realDN);
  let max2 = analyzedExtremReal.max;
  let maxX2 = analyzedExtremReal.index;

  let max = (max2 > max1)? max2 : max1; //Math.max(max1, max2);
  let maxX = (max2 > max1)? maxX2 : maxX1; //Math.max(maxX1, maxX2);
  console.log('evaluateVerhulst() max = ' + max + '; maxX = ' + maxX);
  console.log('evaluateVerhulst() N_in_max = ' + functionValuesN[maxX] );


  let isMax = ( max !== null );
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
    M = Math.round(wholePopulation * 0.0025);
  } else {
    const distanceToStart = lastX - startIndex;
    const middleEpedemyTimeToExtrem = 30;
    let factorToTop = distanceToStart / middleEpedemyTimeToExtrem;
    factorToTop = (factorToTop > 1.0)? factorToTop = 0.9 : factorToTop;
    M = Math.round(functionValuesN[functionValuesN.length - 1] / factorToTop) * 2;
  }
  console.log('evaluateVerhulst() M = ' + M);

  const daysForLastR = 7;
  const startXforR = (lastX > daysForLastR) ? lastX - daysForLastR : 0;
  const rLast = getAverageR(startXforR, lastX, M, functionValuesN);
  console.log('evaluateVerhulst() rLast = ' + rLast);

  let arrayForecastDN = [];
  let arrayForecastN = [];
  let N = functionValuesN[functionValuesN.length - 1];
  let dN = functionValuesDN[functionValuesDN.length - 1];
  let amount = 0;
  const MAX_FORECAST_PERIOD_DAYS = 120;

  console.log('evaluateVerhulst() dN = ' + dN + '; N = ' + N + '; amount = ' + amount);
  while (dN > 0 && amount < MAX_FORECAST_PERIOD_DAYS) {
    dN = getDailyDelta(rLast, N, M);
    N += dN;
    arrayForecastDN.push(dN);
    arrayForecastN.push(N);
    amount++;
    console.log('evaluateVerhulst() dN = ' + dN + '; N = ' + N + '; amount = ' + amount);
  }

  const reached0 = (dN === 0 || dN < 0);
  let arrayN = functionValuesN.slice().concat(arrayForecastN);
  let arrayDN = functionValuesDN.slice().concat(arrayForecastDN);

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

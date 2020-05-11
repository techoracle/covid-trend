import {extrem, createSimpleArrayX} from './function-analyzer';
import evaluateLinearRegression from './linear';

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

  let max = (maxXReal > maxXSmoothing)? maxReal : maxSmoothing;
  let maxX = (maxXReal > maxXSmoothing)? maxXReal : maxXSmoothing;
  console.log('evaluateVerhulst() max = ' + max + '; maxX = ' + maxX);
  console.log('evaluateVerhulst() N_in_max = ' + functionValuesN[maxX] );

  // very important to know: is maximum of daily infected already reached?
  const isMax = ( max !== null );

  // estimated maximum infected people
  let M;

  const r0 = getR0(startIndex, isMax, maxX, functionValuesN);
  const lastX = functionValuesN.length - 1;
  const lastN = functionValuesN[functionValuesN.length - 1];

  // let's try to estimate value of maximal infected people M
  if (isMax) {
    M = functionValuesN[maxX] * 2;
    console.log('evaluateVerhulst() doubled M = ' + M + ', lastN = ' + lastN);
    if (M < lastN) {
      M = Math.round(lastN * 1.3);
      console.log('evaluateVerhulst() corrected M = ' + M + ', lastN = ' + lastN);
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
  const MAX_FORECAST_PERIOD_DAYS = 720;
  const MAX_FORECAST_PERIOD_DAYS_TO_SHOW = 120;
  const linearParams = getLinearParams(functionValuesDN);
  const nextExpectedY = linearParams.nextY;
  const linearSlope = linearParams.slope;
  const linearCoeff = linearParams.coeff;
  console.log('evaluateVerhulst() linearParams nextExpectedY = ' + nextExpectedY + '; linearCoeff = ' + linearCoeff + '; linearSlope = ' + linearSlope);
  M = approximateM(rLast, N, M, nextExpectedY, linearCoeff);
  console.log('evaluateVerhulst() approximated M = ' + M + '; N = ' + N + '; nextExpectedY = ' + nextExpectedY + '; linearSlope = ' + linearSlope);

  const COEFF_OF_PANDEMY_END = 0.9999;
  // let's calculate Verhulst forecast
  console.log('evaluateVerhulst() dN = ' + dN + '; N = ' + N + '; amount = ' + amount);
  let offsetToEnd = 0.0;
  while (offsetToEnd < COEFF_OF_PANDEMY_END && dN > 0 && amount < MAX_FORECAST_PERIOD_DAYS) {
    dN = getDailyDelta(rLast, N, M);
    N += dN;
    offsetToEnd = N / M;
    if (amount < MAX_FORECAST_PERIOD_DAYS_TO_SHOW) {
      arrayForecastDN.push(dN);
      arrayForecastN.push(N);
    }
    amount++;
//    console.log('evaluateVerhulst() dN = ' + dN + '; N = ' + N + '; amount = ' + amount);
  }
  console.log('evaluateVerhulst() dN = ' + dN + '; N = ' + N + '; offsetToEnd = ' + offsetToEnd + '; amount = ' + amount);

  // is a day of "pandemy end" found?
  const reachedEnd = (offsetToEnd >= COEFF_OF_PANDEMY_END || dN === 0);
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
  result['reachedEnd'] = reachedEnd;

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

/**
 * Calculate simple linear parameters by 2 points
 *
 * @param points      points of linear
 * @returns {Object}  linear parameters
 */
function getLinearParams(points) {
  let result = {};
  const MAX_ANALYZED_VALUES = 2;
  const arrayX = createSimpleArrayX(0, MAX_ANALYZED_VALUES);
  const arrayForecast = createSimpleArrayX(MAX_ANALYZED_VALUES, 1);
  const arrayY = points.slice(-1 * MAX_ANALYZED_VALUES);
  const lastY = points[points.length - 1];
  const previousY = points[points.length - 2];

  const calculatedInterpolating = evaluateLinearRegression(arrayForecast, arrayX, arrayY);
  const arrayForecastCalculated = calculatedInterpolating.arrayY;
  result['slope'] = calculatedInterpolating.slope;
  result['nextY'] = arrayForecastCalculated[0];
  result['coeff'] = (previousY !== 0)? lastY / previousY : 0;
  return result;
}

function approximateM(r, N, M, linearY, linearCoeff) {
  const newM = approximateMByNextY(r, N, M, linearY);
//  return approximateMByCoeff(r, N, newM, linearY, linearCoeff);
  return newM;
}

/**
 * Approximate maximum infected people M by first forecast value N (infected people at the start time) and average growth speed R
 *
 * @param r           average growth speed for last days R
 * @param N           infected people at the start forecast time, it will be approximated to the point linearY
 * @param M           last expected maximal infected people M
 * @param linearY     approximated by linear regression point for start value N
 * @returns {number}  improved value M
 */
function approximateMByNextY(r, N, M, linearY) {
  let dN = getDailyDelta(r, N, M);
  const acceptableError = Math.round(dN * 0.01);
  let newM = M;
  let nearstM = M;
  let diff = dN - linearY;
  let minDiff = Math.abs(diff);
  const direction = diff > 0 ? -1 : 1;
  let count = 0;
  console.log('approximateMByNextY() diff = ' + diff + ', direction = ' + direction
    + ', first dN = ' + dN + ', linearY = ' + linearY);
  while (Math.abs(diff) > acceptableError && count < 1000 ) {
    newM += newM * 0.0005 * direction;
    dN = getDailyDelta(r, N, newM);
    diff = Math.abs(dN - linearY);
    if (diff < minDiff) {
      minDiff = diff;
      nearstM = newM;
    }
    count++;
  }
  console.log('approximateMByNextY() nearstM = ' + nearstM + ', minDiff = ' + minDiff+ ', count = '
    + count+ ', diff = ' + diff+ ', dN = ' + dN);
  return Math.round(nearstM);
}

/**
 * Approximate maximal infected people by linear coefficient
 *
 * @param r
 * @param N
 * @param M
 * @param linearY
 * @param linearCoeff
 * @returns {number}
 *
 * @Deprecated
 */
function approximateMByCoeff(r, N, M, linearY, linearCoeff) {
  let dN = getDailyDelta(r, N, M);
  let newM = M;
  let nearstM = M;
  let diff = dN - linearY;
  let minDiff = null;
  const direction = diff > 0 ? -1 : 1;
  let count = 0;
  let dN1, dN2, coeff;
  console.log('approximateM() diff = ' + diff + ', direction = ' + direction + ', first dN = ' + dN + ', linearY = ' + linearY + ', linearCoeff = ' + linearCoeff);
  diff = 1;
  while (diff > 0.005 && count < 1000 ) {
    newM += newM * 0.0005 * direction;

    dN1 = getDailyDelta(r, N, newM);
    dN2 = getDailyDelta(r, N + dN1, newM);
    coeff = (dN1 !== 0)? dN2 / dN1 : 0;

    diff = Math.abs(linearCoeff - coeff);
    if (diff < minDiff || minDiff === null) {
      minDiff = diff;
      nearstM = newM;
    }
    count++;
//    console.log('approximateM() minDiff = ' + minDiff + ', diff = ' + diff + ', coeff = ' + coeff + ', linearCoeff = ' + linearCoeff + ', nearstM = ' + nearstM + ', newM = ' + newM + ', count = ' + count);

  }
  console.log('approximateM() nearstM = ' + nearstM + ', minDiff = ' + minDiff+ ', count = ' + count+ ', diff = ' + diff+ ', dN = ' + dN);
  return Math.round(nearstM);
}


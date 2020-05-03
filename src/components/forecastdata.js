import evaluateLinearRegression from '@/math/linear';
import evaluateVerhulst from '@/math/verhulst';
import evaluatePolynomialInterpolation from '@/math/polynomial-interpolation';
import {createSimpleArrayX} from '@/math/function-analyzer';
import moment from 'moment';

export {createForecastData, createForecastDataVerhulst};

function createForecastData(points, amount, algorithm) {
  let result = {};
  const MAX_ANALYZED_VALUES = 15;
  const arrayX = createSimpleArrayX(0, MAX_ANALYZED_VALUES);
  const arrayForecast = createSimpleArrayX(MAX_ANALYZED_VALUES, amount);
  const arrayY = points.slice(-1 * MAX_ANALYZED_VALUES);

  const calculatedInterpolating = (algorithm === 'linear')?
    evaluateLinearRegression(arrayForecast, arrayX, arrayY) :
    evaluatePolynomialInterpolation(arrayForecast, arrayX, arrayY);

  const arrayForecastCalculated = calculatedInterpolating.arrayY;
  const reached0 = calculatedInterpolating.reached0;
  const labels = generateDateLabels(arrayForecastCalculated.length);
  const calculatedEndDate = getEndDate(reached0, labels, arrayY);

  result['labels'] = labels;
  result['arrayForecastCalculated'] = arrayForecastCalculated;
  result['showEndDate'] = calculatedEndDate.showEndDate;
  result['endDate'] = calculatedEndDate.endDate;
  result['isEndDateInPast'] = calculatedEndDate.isEndDateInPast;

  return result;
}

/**
 * Evaluates interpolating Verhulst logistic curve up to forecast end
 *
 * @param {Array} functionValuesN             set of population values
 * @param {Array} functionValuesDN            set of daily grow of population values based on smoothing data
 * @param {Array} realDN                      set of daily grow of population values based on statistic data
 * @param {Number} wholePopulation            amount of whole population
 * @returns {Array}                           interpolating Verhulst logistic curve
 */
function createForecastDataVerhulst(functionValuesN, functionValuesDN, realDN, wholePopulation) {
  let result = {};

  const calculatedVerhulst = evaluateVerhulst(functionValuesN, functionValuesDN, realDN, wholePopulation);

  const labels = generateDateLabels(calculatedVerhulst.arrayForecastN.length);
  const calculatedEndDate = getEndDate(calculatedVerhulst.reached0, labels, functionValuesDN);

  result['labels'] = labels;
  result['arrayForecastDN'] = calculatedVerhulst.arrayForecastDN;
  result['arrayForecastN'] = calculatedVerhulst.arrayForecastN;
  result['arrayDN'] = calculatedVerhulst.arrayDN;
  result['arrayN'] = calculatedVerhulst.arrayN;
  result['reached0'] = calculatedVerhulst.reached0;

  result['showEndDate'] = calculatedEndDate.showEndDate;
  result['endDate'] = calculatedEndDate.endDate;
  result['isEndDateInPast'] = calculatedEndDate.isEndDateInPast;

  return result;
}

function generateDateLabels(amount) {
  const result = [];
  for (let i = 1; i <= amount; i++) {
    result.push(moment().add(i, 'days').format('YYYY-MM-DD'));
  }
  return result;
}

function getEndDate(reached0, labels, arrayY) {
  let result = {};

  let showEndDate = false;
  let isEndDateInPast = false;
  let endDate = '';
  const lastY = arrayY[arrayY.length - 1];
  console.log("lastY = " + lastY);

  if (lastY === 0) {
    showEndDate = true;
    isEndDateInPast = true;
    endDate = '';
  } else if (reached0) {
    showEndDate = true;
    endDate = labels[labels.length - 1];
  }

  result['showEndDate'] = showEndDate;
  result['endDate'] = endDate;
  result['isEndDateInPast'] = isEndDateInPast;
  return result;

}

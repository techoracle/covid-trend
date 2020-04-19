import evaluateLinearRegression from './linear';
import moment from 'moment';

export default createForecastData;

function createForecastData(points, amount) {
  let result = {};
  const MAX_ANALYZED_VALUES = 15;
  const arrayX = createSimpleArrayX(MAX_ANALYZED_VALUES, 0);
  const arrayForecast = createSimpleArrayX(amount, MAX_ANALYZED_VALUES);
  const arrayY = points.slice(-1 * MAX_ANALYZED_VALUES);

  const calculatedLinearRegression = evaluateLinearRegression(arrayForecast, arrayX, arrayY);
  const arrayForecastCalculated = calculatedLinearRegression.arrayY;
  const slope = calculatedLinearRegression.slope;
  const reached0 = calculatedLinearRegression.reached0;
  const labels = generateDateLabels(arrayForecastCalculated.length);
  const calculatedEndDate = getEndDate(reached0, slope, labels);

  result['labels'] = labels;
  result['arrayForecastCalculated'] = arrayForecastCalculated;
  result['showEndDate'] = calculatedEndDate.showEndDate;
  result['endDate'] = calculatedEndDate.endDate;

  return result;
}

function createSimpleArrayX(amount, firstvalue) {
  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(i + firstvalue);
  }
  return result;
}

function generateDateLabels(amount) {
  const result = [];
  for (let i = 1; i <= amount; i++) {
    result.push(moment().add(i, 'days').format('YYYY-MM-DD'));
  }
  return result;
}

function getEndDate(reached0, slope, labels) {
  let result = {};

  let showEndDate = false;
  let endDate = '';

  if (slope === 0) {
    showEndDate = true;
    endDate = $t('alreadyReached');
  } else if (reached0) {
    showEndDate = true;
    endDate = labels[labels.length - 1];
  }

  result['showEndDate'] = showEndDate;
  result['endDate'] = endDate;
  return result;

}

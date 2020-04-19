import evaluateLinearRegression from './linear';
import chartdata from '../assets/forecastTemplate';

export default createForecastData;

function createForecastData(points, amount) {
  const MAX_ANALYZED_VALUES = 15;
  const arrayX = createSimpleArrayX(MAX_ANALYZED_VALUES, 0);
  const arrayForecast = createSimpleArrayX(amount, MAX_ANALYZED_VALUES);
  const arrayY = points.slice(-1 * MAX_ANALYZED_VALUES);

  const arrayForecastCalculated = evaluateLinearRegression(arrayForecast, arrayX, arrayY);

  chartdata.labels = createSimpleArrayX(arrayForecastCalculated.length, 1);
  chartdata.datasets[0].data = arrayForecastCalculated;

  return chartdata;
}

function createSimpleArrayX(amount, firstvalue) {
  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(i + firstvalue);
  }
  return result;
}

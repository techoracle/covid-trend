import evaluateLinearRegression from './linear';
import {createSimpleArrayX} from './function-analyzer';


export {doubleSmoothing, smoothing};

function doubleSmoothing(arrayY, withNegative) {
  return smoothing(smoothing(arrayY, withNegative), withNegative);
}

function smoothing(arrayY, withNegative) {
  let result = [];
  const offset = 3;
  const arrayX = createSimpleArrayX(0, offset * 2 + 1);

  // copy everything before offset into result
  for (let i = 0; i < offset; i++) {
    result.push(arrayY[i]);
  }

  // smoothing
  for (let i = offset; i < arrayY.length - offset; i++) {
    let analyzeArrayY =arrayY.slice(i - offset, i + offset + 1);
    let calculatedInterpolating = evaluateLinearRegression(offset, arrayX, analyzeArrayY, withNegative);
    const arrayCalculated = calculatedInterpolating.arrayY;
    result.push(arrayCalculated[0]);
  }

  // copy everything after smoothing into result
  for (let i = arrayY.length - offset; i < arrayY.length; i++) {
    let toEnd = arrayY.length - 1 - i;
    let additionalOffset = offset - toEnd;
    let analyzeArrayY =arrayY.slice(i - offset - additionalOffset, arrayY.length);
    let calculatedInterpolating = evaluateLinearRegression(offset + additionalOffset, arrayX, analyzeArrayY, withNegative);
    const arrayCalculated = calculatedInterpolating.arrayY;
    result.push(arrayCalculated[0]);
  }

  return result;
}

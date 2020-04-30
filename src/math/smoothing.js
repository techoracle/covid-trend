import evaluateLinearRegression from './linear';

export default doubleSmoothing;

function doubleSmoothing(arrayY) {
  return smoothing(smoothing(arrayY));
}

function smoothing(arrayY) {
  let result = [];
  const offset = 3;
  const arrayX = createSimpleArrayX(offset * 2 + 1, 0);

  // copy everything before offset into result
  for (let i = 0; i < offset; i++) {
    result.push(arrayY[i]);
  }

  // smoothing
  for (let i = offset; i < arrayY.length - offset; i++) {
    let analyzeArrayY =arrayY.slice(i - offset, i + offset + 1);
    let calculatedInterpolating = evaluateLinearRegression(offset, arrayX, analyzeArrayY);
    const arrayCalculated = calculatedInterpolating.arrayY;
    result.push(arrayCalculated[0]);
  }

  // copy everything after smoothing into result
  for (let i = arrayY.length - offset; i < arrayY.length; i++) {
    let toEnd = arrayY.length - 1 - i;
    let additionalOffset = offset - toEnd;
    let analyzeArrayY =arrayY.slice(i - offset - additionalOffset, arrayY.length);
    let calculatedInterpolating = evaluateLinearRegression(offset + additionalOffset, arrayX, analyzeArrayY);
    const arrayCalculated = calculatedInterpolating.arrayY;
    result.push(arrayCalculated[0]);
  }

  return result;
}

function createSimpleArrayX(amount, firstvalue) {
  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(i + firstvalue);
  }
  return result;
}

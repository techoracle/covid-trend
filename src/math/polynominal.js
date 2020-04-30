'use strict';

export default evaluatePolynomialNevillesAlgorithm;


function createSimpleArrayX(amount) {
  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(i);
  }
  return result;
}

/**
 * Makes argument to be an array if it's not
 *
 * @param input
 * @returns {Array}
 */
function makeItArrayIfItsNot(input) {
  return Object.prototype.toString.call( input ) !== '[object Array]'
    ? [input]
    : input
}

/**
 * Evaluates interpolating polynomial at the set of numbers
 * or at a single number for the function y=f(x)
 *
 * @param {Number|Array} pointsToEvaluate     number or set of numbers
 *                                            for which polynomial is calculated
 * @param {Array} functionValuesX             set of distinct x values
 * @param {Array} functionValuesY             set of distinct y=f(x) values
 * @returns {Array}                           interpolating polynomial
 */

function evaluatePolynomial (pointsToEvaluate, functionValuesX, functionValuesY) {
  const results = [];
  pointsToEvaluate = makeItArrayIfItsNot(pointsToEvaluate);
  // evaluate the interpolating polynomial for each point
  pointsToEvaluate.forEach(function (point) {
    results.push(nevillesIteratedInterpolation(point, functionValuesX, functionValuesY))
  });
  return results
}

/**
 * Neville's Iterated Interpolation algorithm implementation
 * http://en.wikipedia.org/wiki/Neville's_algorithm <- for reference
 *
 * @param {Number} x                           number for which polynomial is calculated
 * @param {Array} X                            set of distinct x values
 * @param {Array} Y                            set of distinct y=f(x) values
 * @returns {number}                           interpolating polynomial
 */

function nevillesIteratedInterpolation (x, X, Y) {
  let Q = [Y];
  for (let i = 1; i < X.length; i++) {
    Q.push([]);
    for (let j = 1; j <= i; j++) {
      Q[j][i] = ((x-X[i-j])*Q[j-1][i] - (x-X[i])*Q[j-1][i-1])/( X[i] - X[i-j] )
    }
  }
  return Q[j-1][i-1]
}

/**
 * Evaluates interpolating polynomial at the set of numbers
 * or at a single number for the function y=f(x)
 *
 * @param {Number|Array} pointsToEvaluate     number or set of numbers
 *                                            for which polynomial is calculated
 * @param {Array} functionValuesX             set of distinct x values
 * @param {Array} functionValuesY             set of distinct y=f(x) values
 * @returns {Array}                           interpolating polynomial
 */

function evaluatePolynomialNevillesAlgorithm (pointsToEvaluate, functionValuesX, functionValuesY) {
  let result = {};
  pointsToEvaluate = makeItArrayIfItsNot(pointsToEvaluate);
  // create points array
  const points = [];
  let pointXY = [];
  for (let i = 0; i < functionValuesX.length; i++) {
    pointXY = [functionValuesX[i], functionValuesY[i]];
    points.push(pointXY);
  }

  let f = nevillesAlgorithm(points);

  // evaluate the interpolating polynomial for each point
  let reached0 = false;
  const arrayY = [];
  pointsToEvaluate.forEach(function (point) {
    let pointY = Math.round(f(point));
    pointY = pointY >= 0 ? pointY : 0;
    if (!reached0) arrayY.push(pointY);
    if (pointY === 0) reached0 = true;
  });

  result['arrayY'] = arrayY;
  result['reached0'] = reached0;

  return result;
}


// Neville's algorithm
function nevillesAlgorithm(points) {
  let n = points.length - 1, p;

  p = function (i, j, x) {
    if (i === j) {
      return points[i][1];
    }

    return ((points[j][0] - x) * p(i, j - 1, x) +
      (x - points[i][0]) * p(i + 1, j, x)) /
      (points[j][0] - points[i][0]);
  };

  return function (x) {
    if (points.length === 0) {
      return 0;
    }
    return p(0, n, x);
  };
}

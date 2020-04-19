'use strict';


export default evaluateLinearRegression;

/**
 * Evaluates interpolating line/lines at the set of numbers
 * or at a single number for the function y=f(x)
 *
 * @param {Number|Array} pointsToEvaluate     number or set of numbers
 *                                            for which polynomial is calculated
 * @param {Array} functionValuesX             set of distinct x values
 * @param {Array} functionValuesY             set of distinct y=f(x) values
 * @returns {Array}
 */

function evaluateLinear(pointsToEvaluate, functionValuesX, functionValuesY) {
  const results = [];
  pointsToEvaluate = makeItArrayIfItsNot(pointsToEvaluate);
  pointsToEvaluate.forEach(function (point) {
    let index = findIntervalBorderIndex(point, functionValuesX);
    if (index == functionValuesX.length - 1) {
      index--;
    }
    let result = linearInterpolation(point, functionValuesX[index], functionValuesY[index],
      functionValuesX[index + 1], functionValuesY[index + 1]);
    results.push(result >= 0 ? result : 0);
  });
  return results;
}

/**
 *
 * Evaluates y-value at given x point for line that passes
 * through the points (x0,y0) and (y1,y1)
 *
 * @param x
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @returns {Number}
 */

function linearInterpolation(x, x0, y0, x1, y1) {
  const a = (y1 - y0) / (x1 - x0);
  const b = -a * x0 + y0;
  return a * x + b;
}

/**
 * Makes argument to be an array if it's not
 *
 * @param input
 * @returns {Array}
 */

function makeItArrayIfItsNot(input) {
  return Object.prototype.toString.call(input) !== '[object Array]'
    ? [input]
    : input;
}

/**
 *
 * Utilizes bisection method to search an interval to which
 * point belongs to, then returns an index of left or right
 * border of the interval
 *
 * @param {Number} point
 * @param {Array} intervals
 * @param {Boolean} useRightBorder
 * @returns {Number}
 */

function findIntervalBorderIndex(point, intervals, useRightBorder) {
  //If point is beyond given intervals
  if (point < intervals[0])
    return 0;
  if (point > intervals[intervals.length - 1])
    return intervals.length - 1;
  //If point is inside interval
  //Start searching on a full range of intervals
  let indexOfNumberToCompare
    , leftBorderIndex = 0
    , rightBorderIndex = intervals.length - 1;
  //Reduce searching range till it find an interval point belongs to using binary search
  while (rightBorderIndex - leftBorderIndex !== 1) {
    indexOfNumberToCompare = leftBorderIndex + Math.floor((rightBorderIndex - leftBorderIndex) / 2);
    point >= intervals[indexOfNumberToCompare]
      ? leftBorderIndex = indexOfNumberToCompare
      : rightBorderIndex = indexOfNumberToCompare;
  }
  return useRightBorder ? rightBorderIndex : leftBorderIndex
}

function evaluateLinearRegression(pointsToEvaluate, functionValuesX, functionValuesY) {
  let result = {};
  const arrayY = [];
  const linearReg = linearRegression(functionValuesX, functionValuesY);
  const slope = linearReg.slope;
  const intercept = linearReg.intercept;
  console.log('slope = ' + slope + '; intercept = ' + intercept);
  let reached0 = false;
  pointsToEvaluate.forEach(function (pointX) {
      let pointY = Math.round(slope * pointX + intercept);
      pointY = pointY >= 0 ? pointY : 0;
      if (!reached0) arrayY.push(pointY);
      if (pointY === 0) reached0 = true;
    }
  );

  result['arrayY'] = arrayY;
  result['slope'] = slope;
  result['intercept'] = intercept;
  result['reached0'] = reached0;

  return result;
}



function linearRegression(arrayX, arrayY) {
  let lr = {};
  let n = arrayY.length;
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let sum_yy = 0;

  for (let i = 0; i < arrayY.length; i++) {

    sum_x += arrayX[i];
    sum_y += arrayY[i];
    sum_xy += (arrayX[i] * arrayY[i]);
    sum_xx += (arrayX[i] * arrayX[i]);
    sum_yy += (arrayY[i] * arrayY[i]);
  }

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
  lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

  return lr;
}

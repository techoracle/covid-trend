const math = require('mathjs');

export default evaluatePolynomialInterpolation;

function processPoints(points) {
  // sort array by x values
  points.sort(function(a, b) {
    if (a.x < b.x) return -1;
    if (a.x === b.x) return 0;
    return 1;
  });

  for (let i = 0; i < points.length; i++) {
    if (i < points.length - 1 && points[i].x === points[i + 1].x) {
      // two points have the same x-value

      // check if the y-value is the same
      if (points[i].y === points[i + 1].y) {
        // remove the latter
        points.splice(i, 1);
        i--;
      }
      else {
        throw Error('SameXDifferentY')
      }
    }
  }

  if (points.length < 2) {
    throw Error('NotEnoughPoints');
  }

  return points;
}

function getMinMax(points) {
  // determine max and min x and y values
  minX = points[0].x;
  maxX = points[0].x;
  minY = points[0].y;
  maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    maxX = Math.max(maxX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxY = Math.max(maxY, points[i].y);
  }

  return {
    minX: minX,
    maxX: maxX,
    minY: minY,
    maxY: maxY
  }
}

/**
 * Evaluates interpolating polynomial at the set of numbers
 * or at a single number for the function y=f(x)
 *
 * @param {Number|Array} pointsToEvaluate     number or set of numbers
 *                                            for which polynomial is calculated
 * @param {Array} functionValuesX             set of distinct x values
 * @param {Array} functionValuesY             set of distinct y=f(x) values
 * @returns {Object}                           interpolating polynomial
 */

function evaluatePolynomialInterpolation (pointsToEvaluate, functionValuesX, functionValuesY) {
  let result = {};
  let points = getPoints(functionValuesX, functionValuesY);
  let coefficients = polynomialInterpolation(points);

  // evaluate the interpolating polynomial for each point
  let reached0 = false;
  const arrayY = [];
  pointsToEvaluate.forEach(function (point) {
    let pointY = Math.round(getY(point, coefficients));
    pointY = pointY >= 0 ? pointY : 0;
    if (!reached0) arrayY.push(pointY);
    if (pointY === 0) reached0 = true;
  });

  result['arrayY'] = arrayY;
  result['reached0'] = reached0;

  return result;
}


function getPoints(arrayX, arrayY) {
  let points = [];
  for (let i = 0; i < arrayX.length; i++) {
    points.push({
      x: arrayX[i],
      y: arrayY[i]
    });
  }

  return points;
}

function getY(x, coefficients) {
  let y = 0;
  for (let i = 0; i < coefficients.length; i++) {
    let c = coefficients[i];
    y += c * Math.pow(x, coefficients.length - i - 1);
  }
  return y;
}

function polynomialInterpolation(p) {
  let m = []; // matrix
  let numPoints = p.length; // number of points

  // fill matrix
  for (let row = 0; row < numPoints; row++) {
    m.push([]);

    for (let col = 0; col < numPoints; col++) {
      m[row][col] = Math.pow(p[row].x, numPoints - col - 1);
    }
    m[row][numPoints] = p[row].y; // solution
  }

  let reducedRowEchelonForm = rref(m);
  let coefficients = [];
  for (let i = 0; i < reducedRowEchelonForm.length; i++) {
    coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
  }
  return coefficients;
}

// Reduced row echelon form
// Taken from https://rosettacode.org/wiki/Reduced_row_echelon_form
// Modified to work with math.js (high float precision).
function rref(mat) {
  let lead = 0;
  for (let r = 0; r < mat.length; r++) {
    if (mat[0].length <= lead) {
      return;
    }
    let i = r;
    while (mat[i][lead] === 0) {
      i++;
      if (mat.length === i) {
        i = r;
        lead++;
        if (mat[0].length === lead) {
          return;
        }
      }
    }

    let tmp = mat[i];
    mat[i] = mat[r];
    mat[r] = tmp;

    let val = mat[r][lead];
    for (let j = 0; j < mat[0].length; j++) {
      mat[r][j] = math.divide(mat[r][j], val);
    }

    for (let i = 0; i < mat.length; i++) {
      if (i === r) continue;
      val = math.bignumber(mat[i][lead]);
      for (let j = 0; j < mat[0].length; j++) {
        mat[i][j] = math.subtract(math.bignumber(mat[i][j]), math.multiply((val), math.bignumber(mat[r][j])));
      }
    }
    lead++;
  }
  return mat;
}

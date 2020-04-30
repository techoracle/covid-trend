export {extrem, bellPosition};


function extrem(arrayY) {
  let result = {};
  let max = 0;
  let index = 0;
  const noResult = null;
  let startIndex = 0;
  let isStartFound = false;

  arrayY.forEach(function(y, i) {
    // calculate maximum
    if (y >= max) {
      max = y;
      index = i;
    }
    // calculate reasonable start point
    if (i > 5 && !isStartFound) {
      if (arrayY[i-5] > 0 && arrayY[i-4] > 0 && arrayY[i-3] > 0
        && arrayY[i-2] > 0 && arrayY[i-1] > 0 && arrayY[i] > 0) {
        startIndex = i - 5;
        isStartFound = true;
      }
    }
  });

  if (index === 0 || index === arrayY.length - 1) {
    max = noResult;
    index = noResult;
  }

  result['max'] = max;
  result['index'] = index;
  result['startIndex'] = startIndex;

  return result;
}

function bellPosition(x, maxX) {
  let position = null;

  if (maxX !== null) {
    if (x < maxX) {
      position = 'up';
    } else if (x === maxX) {
      position = 'top';
    } else if (x > maxX) {
      position = 'down';
    }
  }
  return position;
}


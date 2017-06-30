(function(window, document) {
  'use strict';

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const minNumStrokes = 1;
  const maxNumStrokes = 5;
  const minStrokeWidth = 1;
  const maxStrokeWidth = 5;
  const strokeColour = '#000000';
  const fillColours = [
    '#E4F7F7',
    '#BF0000',
    '#FFF700',
    '#0500EF',
    '#000000'
  ];

  let filledSquareProbability;
  let doFillSquares;
  let fillColour;

  let state = {
    rectangles: [],
    strokes: []
  };

  /**
   * Init
   */
  function init() {
    let regenerateButton = document.getElementById('regenerateButton');
    let filledSquareProbabilityRange = document.getElementById('filledSquareProbabilityRange');
    let fillSquaresCheckbox = document.getElementById('fillSquares');
    let colourSelect = document.getElementById('fillColour');

    regenerateButton.addEventListener('click', generate);
    filledSquareProbabilityRange.addEventListener('change', onFilledSquareProbabilityRangeChange);
    fillSquaresCheckbox.addEventListener('change', onFillSquaresCheckboxChange);
    colourSelect.addEventListener('change', onColourChange);
    canvas.addEventListener('click', onCanvasClick);

    setFilledSquareProbability(filledSquareProbabilityRange.value);
    doFillSquares = fillSquaresCheckbox.checked;

    generate();
  }

  /**
   * Generates a new painting
   */
  function generate() {
    let rows = [];
    let cols = [];
    let rectangles = [];
    let strokes = [];

    let numRows = Math.round(getRandomRange(minNumStrokes, maxNumStrokes));
    let numCols = Math.round(getRandomRange(minNumStrokes, maxNumStrokes));

    // horizontal strokes
    for(let i = 0; i < numRows; i++) {
      rows.push({
        x: 0,
        y: Math.round(Math.random() * canvas.height),
        width: canvas.width,
        height: Math.round(getRandomRange(minStrokeWidth, maxStrokeWidth)),
        colour: strokeColour
      });
    }

    // vertical strokes
    for(let i = 0; i < numCols; i++) {
      cols.push({
        x: Math.round(Math.random() * canvas.width),
        y: 0,
        width: Math.round(getRandomRange(minStrokeWidth, maxStrokeWidth)),
        height: canvas.height,
        colour: strokeColour
      });
    }

    rows = rows.sort((a, b) => a.y - b.y);
    cols = cols.sort((a, b) => a.x - b.x);

    strokes = rows.concat(cols);

    for(let i = 0; i < numRows + 1; i++) {
      let y = (i === 0 ? 0 : rows[i-1].y);
      let height = (i === numRows ? canvas.width : rows[i].y) - y;

      for(let j = 0; j < numCols + 1; j++) {
        let x = (j === 0 ? 0 : cols[j-1].x);
        let width = (j === numCols ? canvas.height : cols[j].x) - x;

        let doColourWhite = !doFillSquares || (Math.random() > filledSquareProbability);
        let colour = doColourWhite ? '#FFFFFF' : fillColours[Math.round(getRandomRange(0, fillColours.length))];
        rectangles.push({x, y, width, height, colour});
      }
    }

    state.rectangles = rectangles;
    state.strokes = strokes;

    drawPainting(state);
  }

  /**
   * Draws a new painting based on the created / altered state
   * @param {Object} state
   */
  function drawPainting(state) {
    let {strokes, rectangles} = state;
    let objects = rectangles.concat(strokes);

    // start with a fresh canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw objects
    for(let k = 0; k < objects.length; k++) {
      let {x, y, width, height, colour} = objects[k];
      drawRectangle(context, x, y, width, height, colour);
    }
  }

  /**
   * Handles the "filled square probability" change event
   * @param {Event} event
   */
  function onFilledSquareProbabilityRangeChange(event) {
    setFilledSquareProbability(event.currentTarget.value);
  }

  /**
   * Handles the "fill squares" checkbox change event
   * @param {Event} event
   */
  function onFillSquaresCheckboxChange(event) {
    doFillSquares = event.currentTarget.checked;
  }

  /**
   * Handles the "fill colour" change event
   * @param {Event} event
   */
  function onColourChange(event) {
    let target = event.currentTarget;
    fillColour = target.options[target.selectedIndex].value;
  }

  /**
   * Handles the canvas click event
   * @param {Event} event
   */
  function onCanvasClick(event) {
    let rectangles = state.rectangles.slice(0);

    for(let i = 0; i < rectangles.length; i++) {
      let {x, y, width, height, colour} = rectangles[i];

      if(event.offsetX > x && event.offsetX < x + width) {
        if(event.offsetY > y && event.offsetY < y + height) {
          rectangles[i].colour = fillColour;
        }
      }
    }

    state.rectangles = rectangles;

    drawPainting(state);
  }

  /**
   * Draws a rectangle on the given context
   * @param {int} context
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {String} colour
   */
  function drawRectangle(context, x, y, width, height, colour) {
    context.fillStyle = colour;
    context.fillRect(x, y, width, height);
  }

  /**
   * Sets the "filled square probability" value
   * @param {Number} value - A value between 0 and 100
   */
  function setFilledSquareProbability(value) {
    filledSquareProbability = value / 100;
  }

  /**
   * Returns a value between min and max
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   */
  function getRandomRange(min, max) {
    return (Math.random() * (max - min)) + min;
  }

  init();

}(window, document));

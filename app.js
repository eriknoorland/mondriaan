(function(window, document) {
  'use strict';

  const regenerateButton = document.getElementById('regenerateButton');
  const filledSquareProbabilityRange = document.getElementById('filledSquareProbabilityRange');
  const fillSquaresCheckbox = document.getElementById('fillSquares');
  const colourSelect = document.getElementById('fillColour');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  const minNumStrokes = 1;
  const maxNumStrokes = 5;
  const minStrokeWidth = 1;
  const maxStrokeWidth = 5;
  const strokeColour = '#000000';
  const fillColours = [
    { name: 'Light Blue', hex: '#E4F7F7' },
    { name: 'Red', hex: '#BF0000' },
    { name: 'Yellow', hex: '#FFF700' },
    { name: 'Blue', hex: '#0500EF' },
    { name: 'Black', hex: '#000000' },
  ];

  const state = { rectangles: [], strokes: [] };

  let filledSquareProbability;
  let doFillSquares;
  let fillColour;

  /**
   * Init
   */
  function init() {
    setFilledSquareProbability(filledSquareProbabilityRange.value);
    doFillSquares = fillSquaresCheckbox.checked;
    fillColour = colourSelect.options[colourSelect.selectedIndex].value;

    colourSelect.innerHTML += fillColours.reduce((acc, colour) => {
      return `${acc}${renderColourOption(colour)}`;
    }, '');

    generate();
    bindEvents();
  }

  /**
   * Bind handlers to events
   */
  function bindEvents() {
    regenerateButton.addEventListener('click', generate);
    filledSquareProbabilityRange.addEventListener('change', onFilledSquareProbabilityRangeChange);
    fillSquaresCheckbox.addEventListener('change', onFillSquaresCheckboxChange);
    colourSelect.addEventListener('change', onColourChange);
    canvas.addEventListener('click', onCanvasClick);
  }

  /**
   * Generates a new painting
   */
  function generate() {
    const numRows = getRandomRange(minNumStrokes, maxNumStrokes);
    const numCols = getRandomRange(minNumStrokes, maxNumStrokes);

    let rows = [];
    let cols = [];
    let rectangles = [];
    let strokes = [];

    // horizontal strokes
    for(let i = 0; i < numRows; i++) {
      rows.push({
        x: 0,
        y: Math.round(Math.random() * canvas.height),
        width: canvas.width,
        height: getRandomRange(minStrokeWidth, maxStrokeWidth),
        colour: strokeColour
      });
    }

    // vertical strokes
    for(let i = 0; i < numCols; i++) {
      cols.push({
        x: Math.round(Math.random() * canvas.width),
        y: 0,
        width: getRandomRange(minStrokeWidth, maxStrokeWidth),
        height: canvas.height,
        colour: strokeColour
      });
    }

    rows = rows.sort((a, b) => a.y - b.y);
    cols = cols.sort((a, b) => a.x - b.x);
    strokes = rows.concat(cols);

    for(let i = 0; i < numRows + 1; i++) {
      const y = (i ? rows[i - 1].y : 0);
      const height = (i === numRows ? canvas.width : rows[i].y) - y;

      for(let j = 0; j < numCols + 1; j++) {
        const x = (j ? cols[j - 1].x : 0);
        const width = (j === numCols ? canvas.height : cols[j].x) - x;
        const isWhite = !doFillSquares || (Math.random() > filledSquareProbability);
        const colour = isWhite ? '#FFFFFF' : fillColours[getRandomRange(0, fillColours.length - 1)].hex;

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
    const {strokes, rectangles} = state;
    const objects = rectangles.concat(strokes);

    context.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(({ x, y, width, height, colour }) => {
      context.fillStyle = colour;
      context.fillRect(x, y, width, height);
    });
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
    filledSquareProbabilityRange.disabled = !doFillSquares;
  }

  /**
   * Handles the "fill colour" change event
   * @param {Event} event
   */
  function onColourChange({ currentTarget }) {
    fillColour = currentTarget.options[currentTarget.selectedIndex].value;
  }

  /**
   * Handles the canvas click event
   * @param {Event} event
   */
  function onCanvasClick({ offsetX, offsetY}) {
    const rectangles = state.rectangles.slice(0);

    rectangles.forEach((rectangle) => {
      const {x, y, width, height, colour} = rectangle;

      if(offsetX > x && offsetX < x + width) {
        if(offsetY > y && offsetY < y + height) {
          rectangle.colour = fillColour;
        }
      }
    });

    state.rectangles = rectangles;

    drawPainting(state);
  }

  /**
   * Sets the "filled square probability" value
   * @param {Number} value - A value between 0 and 100
   */
  function setFilledSquareProbability(value) {
    filledSquareProbability = value / 100;
  }

  /**
   * Returns a rendered option
   * @param {Object} colour
   * @return {String}
   */
  function renderColourOption(colour) {
    return `<option value="${colour.hex}">${colour.name}</option>`;
  }

  /**
   * Returns a value between min and max
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   */
  function getRandomRange(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
  }

  init();

}(window, document));

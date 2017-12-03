/**
 * Returns a value between min and max
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
const getRandomRange = (min, max) => {
  return Math.floor((Math.random() * ((max + 1) - min)) + min);
  // return Math.round((Math.random() * (max - min)) + min);
};

export default getRandomRange;

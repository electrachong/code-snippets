/*
Problem:
  Given an unsorted iternary in the following format:
    [['SFO', 'BEX'], ['LAX', 'SFO'], ['BEX', 'SLO']]
  Return a sorted iternary, e.g.
    [['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]

Example inputs:
  [['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]
  [1,2], [2,3], [3,4]
*/

const { printDebug } = require('../util/util');

/**
 * Class representing a trip.
 * May not be strictly necessary yet since we don't utilize the getters so far.
 */
class Trip {
  /**
   * Create a trip.
   * @constructor
   * @param {string} departure - Point of departure
   * @param {string} destination - Arrival or destination
   */
  constructor(departure, destination) {
    this._departure = departure;
    this._destination = destination;
  }

  /**
   * Get the departure.
   * @return {string} The departure.
   */
  get departure() {
    return this._departure;
  }

  /**
   * Get the destination.
   * @return {string} The destination.
   */
  get destination() {
    return this._destination;
  }

  /**
   * Convert a trip into an array of two items representing the trip.
   * @return {string[]} [departure, destination]
   */
  toArray() {
    return [this._departure, this._destination];
  }
}

/**
 * Iterate over an unsorted array of trips and return mappings of
 * destinations by departures and departures by destinations.
 * @param {Array.<string[]>} unsortedList - unsorted array of trip arrays
 * @return {object[]} [destinationByDeparture, departureByDestination]
 */
function getTripMappings(unsortedList) {
  const destinationByDeparture = {};
  const departureByDestination = {};
  unsortedList.forEach((trip) => {
    const [departure, destination] = trip;
    destinationByDeparture[departure] = destination;
    departureByDestination[destination] = departure;
  });
  printDebug('destinationByDeparture', destinationByDeparture);
  printDebug('departureByDestination', departureByDestination);
  return [destinationByDeparture, departureByDestination];
}

/**
 * Return the first trip, by searching for a departure that is not repeated
 * in the list of trips as a destination.
 * @param {object} destinationByDeparture - a mapping of departure keys to
 *  destinations
 * @param {object} departureByDestination - a mapping of destination keys to
 *  departures
 * @return {string[]} the first trip as represented by an array
 */
function findFirstTrip(destinationByDeparture, departureByDestination) {
  const departures = Object.keys(destinationByDeparture);
  let firstTripDeparture = departures.find(departure =>
    // eslint-disable-next-line implicit-arrow-linebreak
    departureByDestination[departure] === undefined);
  const firstTripDestination = destinationByDeparture[firstTripDeparture];
  // if input value originally array of numbers, return value as number
  if (typeof firstTripDestination === 'number') {
    firstTripDeparture = parseInt(firstTripDeparture, 10);
  }
  return [firstTripDeparture, firstTripDestination];
}

/**
 * Find the trip where the current trip's destination is the departure
 * @param {string[]} trip - two-item array of strings representing a trip
 * @param {object} destinationByDeparture - a mapping of departure keys to
 *  destinations
 * @return {Trip|undefined} the next trip or undefined if no next trip
 */
function findNextTrip(trip, destinationByDeparture) {
  const [_, destination] = trip; // eslint-disable-line no-unused-vars
  const nextDestination = destinationByDeparture[destination];
  if (!nextDestination) {
    return undefined;
  }
  return new Trip(destination, nextDestination);
}

/**
 * Find the next trip of the last item in the current array, add to the
 * array and repeat until we have encountered the last trip.
 * @param {Array.<string[]>} sortedList - array containing trips sorted in order
 * @param {object} destinationByDeparture - a mapping of departure keys to
 *  destinations
 * @return {undefined} - MUTATES sortedList by adding arrays representing trips
 */
function sortListToEnd(sortedList, destinationByDeparture) {
  let foundEnd = false;
  while (foundEnd === false) {
    const lastItem = sortedList[sortedList.length - 1];
    const nextTrip = findNextTrip(lastItem, destinationByDeparture);
    printDebug('current sortedList', sortedList);
    printDebug('nextTrip', nextTrip);
    if (nextTrip === undefined) {
      foundEnd = true;
    } else {
      sortedList.push(nextTrip.toArray());
    }
  }
}

/**
 * Given an array of string arrays representing trips which may be out of order,
 * return an array of string arrays with the trips sorted in order.
 * @param {Array.<string[]>} unsortedList - array containing unsorted trips
 * @return {Array.<string[]>} sortedList - array containg sorted trips
 */
function sortIternary(unsortedList) {
  const [destinationByDeparture, departureByDestination] = getTripMappings(unsortedList);
  const firstTrip = findFirstTrip(destinationByDeparture, departureByDestination);
  const sortedList = [];
  sortedList.push(firstTrip);
  sortListToEnd(sortedList, destinationByDeparture);

  return sortedList;
}

/**
 * Print given input and result of calling sortIternary() on the input.
 * @param {Array.<string[]>} input
 * @return {undefined} - but print the result of calling sortIternary()
 */
// eslint-disable-next-line no-unused-vars
function printResult(input) {
  process.stdout.write(`\nFor input ${input}:\n`);
  const output = sortIternary(input);
  process.stdout.write(`Result: ${output}\n\n`);
}

module.exports = { sortIternary, findFirstTrip, getTripMappings };

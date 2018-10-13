/*
Problem:
  Given an unsorted iternary in the following format:
    [['SFO', 'BEX'], ['LAX', 'SFO'], ['BEX', 'SLO']]
  Return a sorted iternary, e.g.
    [['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]

Example inputs:
  [['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]
  [1,2], [2,3], [3,4]

TODO:
  - Probably don't need to push markers to array
*/

const { printDebug } = require('../util/util');

const START = Symbol('start');
const END = Symbol('end');

class Trip {
  constructor(departure, destination) {
    this._departure = departure;
    this._destination = destination;
  }

  get departure() {
    return this._departure;
  }

  get destination() {
    return this._destination;
  }

  toArray() {
    return [this._departure, this._destination];
  }
}

function getTripMappings(unsortedList) {
  const destinationByDeparture = {};
  const departureByDestination = {};
  unsortedList.forEach(trip => {
    const [departure, destination] = trip
    destinationByDeparture[departure] = destination;
    departureByDestination[destination] = departure;
  })
  printDebug('destinationByDeparture', destinationByDeparture);
  printDebug('departureByDestination', departureByDestination);
  return [destinationByDeparture, departureByDestination];
}

// Find the item where the previous departure was the destination
function findPreviousTrip(trip, departureByDestination) {
  const [departure, destination] = trip;
  return new Trip(departureByDestination[departure], departure);
}

// Find the item where the previous destination is the departure
function findNextTrip(trip, destinationByDeparture) {
  const [departure, destination] = trip;
  return new Trip(destination, destinationByDeparture[destination]);
}

// Find the previous trip of the first item in the array, add to the array
// and repeat until we have encountered the first trip.
function sortListToStart(sortedList, departureByDestination) {
  for (let firstItem = sortedList[0]; firstItem !== START; firstItem = sortedList[0]) {
    const previousTrip = findPreviousTrip(firstItem, departureByDestination);
    printDebug('previousTrip', previousTrip);
    if (previousTrip.departure === undefined) {
      // add start marker to indicate we've found the beginning
      sortedList.unshift(START);
    } else {
      sortedList.unshift(previousTrip.toArray());
    }
  }
}

// Find the next trip of the last item in the array, add to the array
// and repeat until we have encountered the last trip.
function sortListToEnd(sortedList, destinationByDeparture) {
  for (
    let lastItem = sortedList[sortedList.length - 1];
    lastItem !== END;
    lastItem = sortedList[sortedList.length - 1]
  ) {
    const nextTrip = findNextTrip(lastItem, destinationByDeparture);
    printDebug('nextTrip', nextTrip);
    if (nextTrip.destination === undefined) {
      // add end marker to indicate we've found the end
      sortedList.push(END);
    } else {
      sortedList.push(nextTrip.toArray());
    }
  }
}

function sortIternary(unsortedList) {
  const [destinationByDeparture, departureByDestination] = getTripMappings(unsortedList);
  const sortedList = [];
  sortedList.push(unsortedList[0]);

  sortListToStart(sortedList, departureByDestination);
  sortListToEnd(sortedList, destinationByDeparture);

  return sortedList.slice(1, sortedList.length - 1);
}

function printResult(input) {
  process.stdout.write(`\nFor input ${input}:\n`);
  const output = sortIternary(input);
  process.stdout.write(`Result: ${output}\n\n`);
}

module.exports = sortIternary;

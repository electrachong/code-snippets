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
  - Improve semantics
  - Lint and js docs
*/

const { printDebug } = require('../util/util');

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
  const previousDeparture = departureByDestination[departure];
  if (!previousDeparture) {
    return undefined;
  }
  return new Trip(previousDeparture, departure);
}

// Find the item where the previous destination is the departure
function findNextTrip(trip, destinationByDeparture) {
  const [departure, destination] = trip;
  const nextDestination = destinationByDeparture[destination];
  if (!nextDestination) {
    return undefined;
  }
  return new Trip(destination, nextDestination);
}

// Find the previous trip of the first item in the array, add to the array
// and repeat until we have encountered the first trip.
function sortListToStart(sortedList, departureByDestination) {
  let foundStart = false;
  while (foundStart === false) {
    const firstItem = sortedList[0];
    const previousTrip = findPreviousTrip(firstItem, departureByDestination);
    printDebug('current sortedList', sortedList)
    printDebug('previousTrip', previousTrip);
    if (previousTrip === undefined) {
      foundStart = true
    } else {
      sortedList.unshift(previousTrip.toArray());
    }
  }
}

// Find the next trip of the last item in the array, add to the array
// and repeat until we have encountered the last trip.
function sortListToEnd(sortedList, destinationByDeparture) {
  let foundEnd = false;
  while (foundEnd === false) {
    const lastItem = sortedList[sortedList.length - 1]
    const nextTrip = findNextTrip(lastItem, destinationByDeparture);
    printDebug('current sortedList', sortedList)
    printDebug('nextTrip', nextTrip);
    if (nextTrip === undefined) {
      foundEnd = true;
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

  return sortedList
}

function printResult(input) {
  process.stdout.write(`\nFor input ${input}:\n`);
  const output = sortIternary(input);
  process.stdout.write(`Result: ${output}\n\n`);
}

module.exports = sortIternary;

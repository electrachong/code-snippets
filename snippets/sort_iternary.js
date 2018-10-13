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
  - More syntactic sugar
*/

const { printDebug } = require('../util/util');

const START = Symbol('start');
const END = Symbol('end');

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
  return [departureByDestination[departure], departure];
}

// Find the item where the previous destination is the departure
function findNextTrip(trip, destinationByDeparture) {
  const [departure, destination] = trip;
  return [destination, destinationByDeparture[destination]];
}

function sortIternary(unsortedList) {
  const [destinationByDeparture, departureByDestination] = getTripMappings(unsortedList);
  const sortedList = [];
  sortedList.push(unsortedList[0]);

  // Find the previous trip of the first item in the array, add to the array
  // and repeat until we have encountered the first trip.
  for (let firstItem = sortedList[0]; firstItem !== START; firstItem = sortedList[0]) {
    const previousTrip = findPreviousTrip(firstItem, departureByDestination);
    printDebug('previousTrip', previousTrip);
    if (previousTrip[0] === undefined) {
      // add start marker to indicate we've found the beginning
      sortedList.unshift(START);
    } else {
      sortedList.unshift(previousTrip);
    }
  }

  // Find the next trip of the last item in the array, add to the array
  // and repeat until we have encountered the last trip.
  for (
    let lastItem = sortedList[sortedList.length - 1];
    lastItem !== END;
    lastItem = sortedList[sortedList.length - 1]
  ) {
    const nextTrip = findNextTrip(lastItem, destinationByDeparture);
    printDebug('nextTrip', nextTrip);
    if (nextTrip[1] === undefined) {
      // add end marker to indicate we've found the end
      sortedList.push(END);
    } else {
      sortedList.push(nextTrip);
    }
  }

  return sortedList.slice(1, sortedList.length - 1);
}

function printResult(input) {
  process.stdout.write(`\nFor input ${input}:\n`);
  const output = sortIternary(input);
  process.stdout.write(`Result: ${output}\n\n`);
}

module.exports = sortIternary;

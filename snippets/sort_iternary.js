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
  - Don't need to use combined loop, have a loop for each direction
  - Add tests
*/
const { debug } = require('../util/util.js')

const START = Symbol('start')
const END = Symbol('end')

function getTripMappings(unsortedList) {
  const destinationByDeparture = {};
  const departureByDestination = {};
  unsortedList.forEach(trip => {
    const [departure, destination] = trip
    destinationByDeparture[departure] = destination;
    departureByDestination[destination] = departure;
  })
  debug('destinationByDeparture', destinationByDeparture)
  debug('departureByDestination', departureByDestination)
  return [destinationByDeparture, departureByDestination];
}

// Find the item where the previous departure was the destination
function findPreviousTrip(trip, departureByDestination) {
  const [departure, destination] = trip
  return [departureByDestination[departure], departure]
}

// Find the item where the previous destination is the departure
function findNextTrip(trip, destinationByDeparture) {
  const [departure, destination] = trip
  return [destination, destinationByDeparture[destination]]
}

function sortIternary(unsortedList) {
  const [destinationByDeparture, departureByDestination] = getTripMappings(unsortedList);
  const sortedList = [];
  sortedList.push(unsortedList[0]);

  let firstItem = sortedList[0];
  let lastItem = sortedList[sortedList.length - 1]

  // Check if we have found the terminal trip on either end, and if not,
  // use the existing first or last item to find the next or previous trip
  while (!(firstItem === START && lastItem === END)) {
    debug('current sortedList', sortedList)
    if (firstItem !== START) {
      const previousTrip = findPreviousTrip(sortedList[0], departureByDestination)
      debug('previousTrip', previousTrip)
      if (previousTrip[0] === undefined) {
        // add start marker to indicate we've found the beginning
        sortedList.unshift(START)
      } else {
        sortedList.unshift(previousTrip)
      }
    } else {
      const nextTrip = findNextTrip(sortedList[sortedList.length - 1], destinationByDeparture)
      debug('nextTrip', nextTrip)
      if (nextTrip[1] === undefined) {
        // add end marker to indicate we've found the end
        sortedList.push(END)
      } else {
        sortedList.push(nextTrip)
      }
    }
    firstItem = sortedList[0];
    lastItem = sortedList[sortedList.length - 1]
  }
  return sortedList.slice(1, sortedList.length - 1)
}

function printResult(input) {
  process.stdout.write(`\nFor input ${input}:\n`)
  const output = sortIternary(input)
  process.stdout.write(`Result: ${output}\n\n`)
}

printResult([['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']])
printResult([['LAX', 'SFO'], ['BEX', 'SLO'],  ['SFO', 'BEX']])
printResult([[1,2], [2,3], [3,4]])
printResult([[2,3], [1,2], [3,4]])

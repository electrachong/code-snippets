/* example inputs:
[['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]
[1,2], [2,3], [3,4]
*/

function orderTrip(array) {
  const destinationByDeparture = {}
  const departureByDestination = {}
  array.forEach(trip => {
    const departure = trip[0]
    const destination = trip[1]
    destinationByDeparture[departure] = destination
    departureByDestination[destination] = departure
  })
  // console.log('destinationByDeparture', destinationByDeparture)
  // => destinationByDeparture { LAX: 'SFO', SFO: 'BEX', BEX: 'SLO' }
  // console.log('departureByDestination', departureByDestination)
  // => departureByDestination { SFO: 'LAX', BEX: 'SFO', SLO: 'BEX' }
  const newArray = []
  newArray.push(array[0]) // ['LAX', 'SFO']
  const [previousTrip, nextTrip] = findNeighborsForFirstTrip(array[0], destinationByDeparture, departureByDestination)
  if (previousTrip[0] === undefined) {
    newArray.unshift('START') // add a marker to indicate we've found the beginning
  } else {
    newArray.unshift(previousTrip)
  }
  if (nextTrip[1] === undefined) {
    newArray.push('END') // add a marker to indicate we've found the end
  } else {
    newArray.push(nextTrip)
  }
  // console.log('newArray', newArray) => newArray [ 'START', [ 'LAX', 'SFO' ], [ 'SFO', 'BEX' ] ]

  /*
  // __ NOW FOR THE NEXT ITERATION __
  if (newArray[0] === 'START' && newArray[newArray.length - 1] === 'END') {
    // we're finished, can exit out of loop
  }
  if (newArray[0] === 'START') {
    // find next trip for last item in new array
    const newLastTrip = findNextTrip(newArray[newArray.length - 1], destinationByDeparture)
    newArray.push(newLastTrip)
  } else {
    // find the previous trip for the first item in the array
    const newFirstTrip = findPreviousTrip(newArray[0], departureByDestination)
    newArray.unshift(newFirstTrip)
  }
  // console.log('newArray', newArray) =>  [ 'START', [ 'LAX', 'SFO' ], [ 'SFO', 'BEX' ], [ 'BEX', 'SLO' ] ]
  */

  // __ REVISED INTO A LOOP __
  while (!(newArray[0] === 'START' && newArray[newArray.length - 1] === 'END')) {
    if (newArray[0] === 'START') {
      // find next trip for last item in new array
      const newLastTrip = findNextTrip(newArray[newArray.length - 1], destinationByDeparture)
      if (newLastTrip[1] === undefined) {
        newArray.push('END') // add a marker to indicate we've found the end
      } else {
        newArray.push(newLastTrip)
      }
    } else {
      // find the previous trip for the first item in the array
      const newFirstTrip = findPreviousTrip(newArray[0], departureByDestination)
      if (newFirstTrip[0] === undefined) {
        newArray.unshift('START') // add a marker to indicate we've found the beginning
      } else {
        newArray.unshift(newFirstTrip)
      }
    }
  }
  // console.log('newArray', newArray)
  // => newArray [ 'START',
  // [ 'LAX', 'SFO' ],
  // [ 'SFO', 'BEX' ],
  // [ 'BEX', 'SLO' ],
  // 'END' ]
  return newArray.slice(1, newArray.length - 1) // [ [ 'LAX', 'SFO' ], [ 'SFO', 'BEX' ], [ 'BEX', 'SLO' ] ]
}

function findPreviousTrip(trip, departureByDestination) {
  // find the item where the previous departure was the destination
  const departure = trip[0]
  const destination = trip[1]
  return [departureByDestination[departure], departure] // departure, destination
}

function findNextTrip(trip, destinationByDeparture) {
  // find the item where the previous destination (SFO) is the departure
  const departure = trip[0]
  const destination = trip[1]
  return [destination, destinationByDeparture[destination]]
}

function findNeighborsForFirstTrip(trip, destinationByDeparture, departureByDestination) {
  const departure = trip[0]
  const destination = trip[1]
  // console.log('departure', departure) => LAX
  // console.log('destination', destination) => SFO

  // find the item where the previous destination (SFO) is the departure
  // TODO: replace with findNextTrip
  const nextTrip = [destination, destinationByDeparture[destination]]
  // console.log('nextTrip', nextTrip) => nextTrip [ 'SFO', 'BEX' ]

  // find the item where the previous departure (LAX) was the destination
  // TODO: replace with findPreviousTrip
  const previousTrip = [departureByDestination[departure], departure]
  // console.log('previousTrip', previousTrip) => previousTrip [ undefined, 'LAX' ]

  return [previousTrip, nextTrip]
}

console.log(orderTrip([['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]))
console.log(orderTrip([['LAX', 'SFO'], ['BEX', 'SLO'],  ['SFO', 'BEX']]))
console.log(orderTrip([[1,2], [2,3], [3,4]]))
console.log(orderTrip([[2,3], [1,2], [3,4]]))

/* (leftover notes from drafting)
// take the first pair from the hash and push it into the array

const firstTrip = [firstDeparture, firstDestination]
newArray.push(firstTrip) // [LAX, SFO] <-- departure, destination

// if it doesn't exist, that was the last element
if (nextTrip == undefined) {
  // do nothing? may want to set a marker
}
// find the item where the previous departure (LAX) was the destination
const previousTrip = destinationByDeparture[firstDeparture]

// we can also figure out the starting and ending elements
// by counting the number of times we see their members
*/

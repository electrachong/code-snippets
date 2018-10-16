const assert = require('assert')

const { sortIternary, findFirstTrip, getTripMappings } = require('../snippets/sort_iternary')

describe('findFirstTrip', function() {
  it('should return the first trip from an already-sorted array', function() {
    const input = [['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]
    const expectedResult = ['LAX', 'SFO']
    const [destinationByDeparture, departureByDestination] = getTripMappings(input);
    const result = findFirstTrip(destinationByDeparture, departureByDestination)
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should return the first trip from an unsorted array', function() {
    const input = [['SFO', 'BEX'], ['LAX', 'SFO'], ['BEX', 'SLO']]
    const expectedResult = ['LAX', 'SFO']
    const [destinationByDeparture, departureByDestination] = getTripMappings(input);
    const result = findFirstTrip(destinationByDeparture, departureByDestination)
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should also work for non-string values', function() {
    const input = [[3, 4], [1, 2], [2, 3]]
    const expectedResult = [1, 2]
    const [destinationByDeparture, departureByDestination] = getTripMappings(input);
    const result = findFirstTrip(destinationByDeparture, departureByDestination)
    assert.deepStrictEqual(result, expectedResult);
  });
});

describe('sortIternary', function() {
  it('should return the same array if already sorted', function() {
    const input = [['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]
    const result = sortIternary(input)
    assert.deepStrictEqual(input, result);
  });

  it('should return sorted array if not sorted', function() {
    const input = [['SFO', 'BEX'], ['LAX', 'SFO'], ['BEX', 'SLO']]
    const expectedResult = [['LAX', 'SFO'], ['SFO', 'BEX'], ['BEX', 'SLO']]
    const result = sortIternary(input)
    assert.deepStrictEqual(result, expectedResult);
  });

  it('should also work for non-string values', function() {
    const input = [[1, 2], [3, 4], [2, 3]]
    const expectedResult = [[1, 2], [2, 3], [3, 4]]
    const result = sortIternary(input)
    assert.deepStrictEqual(result, expectedResult);
  });
});

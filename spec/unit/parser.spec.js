const _ = require('lodash')
const mocha = require('mocha')
const chai = require('chai')
const expect = chai.expect
const parser = require('../../lib/dataParser.js')

describe('Data extractor', function(){
    const dataSet = require('../fixtures/programming-dataset.json')
    const mapByDomain = ( element ) => element.data.domain

    it('Should return unique values chosen from dataset as an object', function(done){
        const expected =_.uniq(_.flatMap(dataSet['data']['children'], mapByDomain))
        console.time('dataParser')
        const actual = parser(dataSet, ['data', 'children', 'data', 'domain'], [])
        console.timeEnd('dataParser')
        expect(actual).to.be.an('Array');
        expect(actual.length).to.equal(expected.length)
        expect(actual).to.have.members(expected)
        done()
    })

    it('Should return unique values chosen from dataset as an array', function(done){
        const expected =_.uniq(_.flatMap(dataSet['data']['children'], mapByDomain))
        console.time('dataParser')
        const actual = parser(dataSet['data']['children'], ['data', 'domain'], [])
        console.timeEnd('dataParser')
        expect(actual).to.be.an('Array');
        expect(actual.length).to.equal(expected.length)
        expect(actual).to.have.members(expected)
        done()
    })

    it.skip('Should return error if path is not found', function(done){})
})


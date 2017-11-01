const _ = require('lodash')
const mocha = require('mocha')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const parser = require('../../lib/dataParser.js')

describe('Data extractor', function(){
    const dataSet = require('../fixtures/programming-dataset.json')
    const mapByDomain = ( element ) => element.data.domain

    it('Should return chosen fields from dataset', function(done){
        const expected =_.uniq(_.flatMap(dataSet['data']['children'], mapByDomain))
        const actual = parser(dataSet, ['data', 'children', 'data', 'domain'], [])
        expect(actual.length).to.equal(expected.length)
        expect(actual).to.have.members(expected)
        done()
    })
})

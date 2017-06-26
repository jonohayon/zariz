/* eslint-env mocha */
const chai = require('chai')
const getTimeline = require('../lib')
const chaiZariz = require('../lib/chai-plugin')

chai.use(chaiZariz.plugin)
const { expect } = chai

describe('Chai plugin', () => {
  // Ugly code because of scopes ugh
  before(function (done) {
    getTimeline({ url: 'http://jonathano.com/test-page.html' }).then(({ timeline, networkEvents }) => {
      console.log(networkEvents)
      chaiZariz.timeline = timeline
      done()
    })
  })

  it('should correctly check evaluation data', () => {
    expect('jquery.min.js').to.evaluate.under(40)
  })

  it('should correctly check compilation data', () => {
    expect('jquery.min.js').to.compile.under(1)
  })
})

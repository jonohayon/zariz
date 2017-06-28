<h1 align="center">
  Zariz
</h1>

> A site performance test kit, built using Chrome's DevTools.

## Features
 - Measures the load time of resources requested by the page
 - Measures the evaluation and compile time of the page's scripts
 - Easy to use [Chai](http://chaijs.com) plugin for incorporating performance testing into your testing workflow
 - More to come!

## Install
```bash
npm install --save-dev zariz
```

## Example usage
Without the chai plugin:
```javascript
const Zariz = require('zariz')
const path = require('path')
const fs = require('fs')

Zariz.load(url).then(client => {
  return client.startTracing()
}).then(client => {
  return client.endTracing()
}).then(({ timeline, network }) => {
  const st = obj => JSON.stringify(obj, null, 2)
  fs.writeFileSync(path.join(__dirname, 'script-timeline.json'), st(timeline))
  fs.writeFileSync(path.join(__dirname, 'network-data.json'), st(network))
})
```

With the chai plugin:
```javascript
const chai = require('chai')
const Zariz = require('zariz')

chai.use(Zariz.chaiPlugin)

/**
 * If chaiPlugin is too much of a generic name for
 * you and you like deconstruction, this is also doable:
 */
const { chaiZariz } = Zariz
chai.use(chaiZariz)

const { expect } = chai

describe('Load performance testing', () => {
  before(() => {
    return Zariz.load('http://example.com').then(client => {
      return client.startTracing()
    }).then(client => {
      return client.endTracing()
    })
  })

  it('should load a.js under 500ms and evaluate it under 100ms', () => {
    expect('a.js').to.load.under(500)
    expect('a.js').to.evaluate.under(100)
  })

  it('should load b.js and evaluate it under 600ms', () => {
    expect('b.js').to.load()
    expect('b.js').to.evaluate.under(600)
  })

  it('should load the roboto font', () => {
    expect('roboto.ttf').to.load()
    expect('roboto.otf').to.load()
    expect('roboto.woff').to.load()
    expect('roboto.woff2').to.load()
  })
})
```

## API
### Library
```js
Zariz.load(url)
```
Launches a new headless Chrome instance and loads the given url into it. Returns a `Promise` with an object with the remote debugging port of the new instance and a function, `startTracing`.

```js
client.startTracing({ isOnLoad = true })
```
Starts tracing the browser's timeline. Receives a parameter called isOnLoad which is meant to indicate to Zariz whether this is being called straight after the `.load` call or not, which defaults to `true`. Returns a `Promise` an object with a function called `endTracing`.

```js
client.endTracing()
```
Ends tracing the browser's timeline. Returns a `Promise` with an object with the timline and the network arrays.

```js
Zariz.timeline
```
The script timeline events (evaluation and compilation).

```js
Zariz.network
```
The network events.

### Chai plugin
**IMPORTANT - The chai plugin cannot be used without loading the site in node!**
```js
expect(url || filename).to.load()
```
Expects the url / filename to load, without any testing of the load time.

```js
expect(url || filename).to.evaluate()
expect(url || filename).to.compile()
```
Expects the url / filename to be evaluated or compiled, without testing the time these operations take.<br />
*Note - this method only supports JavaScript files at the moment, although I plan on adding CSS support in the future.*

```js
expect(url || filename).to.load.under(ms)
expect(url || filename).to.evaluate.under(ms)
expect(url || filename).to.compile.under(ms)
```
Expects the url/filename to load / evaluate / compile under the given amount of milliseconds.

## TODO
 - [x] Trace the browser's timeline
 - [x] Get the duration of network events
 - [ ] Add support to get file size from the network events
 - [ ] Add a function to get a file's time easily
 - [ ] Add an option to use Zariz on the frontend
 - [ ] Add an option to connect to an already launched Chrome instance
 - [ ] Add support for CSS parsing

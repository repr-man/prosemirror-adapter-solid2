import { render } from '@solidjs/web'

import { App } from './App'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Playground root element was not found')
}

render(() => <App />, root)

import PromisePolyfill from 'promise-polyfill'
import 'core-js/stable/index'
import 'regenerator-runtime/runtime'
import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}

createRoot(document.getElementById('root')).render(<App />)

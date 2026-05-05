import { useState } from 'react'
import Dropzone from './components/dropzone.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <Dropzone/>
  )
}

export default App
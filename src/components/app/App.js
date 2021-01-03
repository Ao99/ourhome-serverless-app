import { useState } from 'react';
import './App.css';
import Header from '../header/Header.js';
import Board from '../board/Board.js';

function App() {
  const [isSignedin, setIsSignedin] = useState(false);

  function handleAuthStateChange(state) {
    if (state === 'signedIn') {
      setIsSignedin(true);
    } else {
      setIsSignedin(false);
    }
  }
  
  return (
    <div className="App">
      <Header onStateChange={handleAuthStateChange} />
      <Board isSignedin={isSignedin} />
    </div>
  );
}

export default App;
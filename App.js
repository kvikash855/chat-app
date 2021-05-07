import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login'

class App extends React.Component {
  render()
  {
    return (
      <div className="App">
        <Login/>
      </div>
    )
  }
  
}

export default App;

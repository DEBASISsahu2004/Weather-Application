import './App.css';
import { Sun, Moon } from 'lucide-react';
import React, { useState } from 'react';
import WeatherPage from './pages/WeatherPage';

function App() {
  const [toogleTheme, setToogleTheme] = useState(false);
  const handleToggleTheme = () => {
    if (!toogleTheme) {
      document.documentElement.style.setProperty('--bg', '#0f0f0f');
      document.documentElement.style.setProperty('--text', '#f8f8f8');
      setToogleTheme(true);
    } else {
      document.documentElement.style.setProperty('--bg', '#f8f8f8');
      document.documentElement.style.setProperty('--text', '#0f0f0f');
      setToogleTheme(false);
    }
  };

  return (
    <>
      <nav className='navbar'>
        <h1 className='title'>Weather</h1>
        <button className='themeToggleButton' type="button" onClick={handleToggleTheme}>
          {toogleTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
      <WeatherPage />
    </>
  )
}

export default App;
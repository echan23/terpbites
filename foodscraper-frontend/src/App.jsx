import React, { useState } from 'react';
import './App.css';
import { SearchBar } from './complements/SearchBar';
import { SearchResultsList } from './complements/SearchResultsList';

function App() {
  const [results, setResults] = useState([]);
  const [location, setLocation] = useState('');  // Track selected location

  return (
    <div className="App">
      <div className="search-bar-container">
        <SearchBar setResults={setResults} setLocation={setLocation} />
        <SearchResultsList results={results} location={location} />
      </div>
    </div>
  );
}

export default App;

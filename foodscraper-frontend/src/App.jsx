import React, { useState } from 'react';
import './index.css';
import './App.css';
import { SearchBar } from './complements/SearchBar';
import { SearchResultsList } from './complements/SearchResultsList';
import { SelectedItemsList } from './complements/SelectedItemsList';
import { NutritionModal } from './complements/NutritionModal';

function App() {
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addItem = (item) => {
    setSelectedItems((prevItems) => {
      if (!prevItems.some((i) => i.name === item.name)) {
        return [...prevItems, { ...item, servings: 1 }];
      }
      return prevItems;
    });
  };

  const removeItem = (item) => {
    setSelectedItems((prevItems) => prevItems.filter((i) => i.name !== item.name));
  };

  const updateServings = (itemName, newServings) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName ? { ...item, servings: Number(newServings) } : item
      )
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <header className="headers">
        <h1>TerpEats</h1>
        <h2>{new Date().toLocaleDateString('en-US')}</h2>
      </header>

      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        <button className="open-modal-button" onClick={openModal}>
          View Total Nutrition
        </button>
      </div>

      <SearchResultsList results={results} addItem={addItem} />
      <SelectedItemsList
        selectedItems={selectedItems}
        removeItem={removeItem}
        updateServings={updateServings} // Pass the updateServings function as a prop
      />

      <footer>
        {new Date().getFullYear()} Edward Chan echan23@github.com
      </footer>

      {isModalOpen && (
        <NutritionModal selectedItems={selectedItems} closeModal={closeModal} />
      )}
    </div>
  );
}

export default App;

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
      const existingItem = prevItems.find((i) => i.name === item.name);

      if (existingItem) {
        return prevItems.map((i) =>
          i.name === item.name ? { ...i, servings: i.servings + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, servings: 1 }];
      }
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
        <h1>TerpBites</h1>
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
        {new Date().toLocaleDateString('en-US')}
      </footer>

      {isModalOpen && (
        <NutritionModal selectedItems={selectedItems} closeModal={closeModal} />
      )}
    </div>
  );
}

export default App;

import React from 'react';
import { SearchResult } from './SearchResult';
import './SearchResultsList.css';

export const SearchResultsList = ({ results, addItem }) => {
  return (
    <div className="results-list-wrapper">
      <div className="results-list">
        {results.length > 0 ? (
          results.map((result) => (
            <SearchResult 
              key={result.name} 
              result={result} 
              onClick={() => addItem(result)}
            />
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  );
};

import React from "react";
import "./SearchResult.css";

export const SearchResult = ({ result, onClick, isRemovable, onRemove }) => {
  return (
    <div className="search-result" onClick={onClick}>
      <div className="search-result-header">
        <span>{result.name}</span>
        {isRemovable && (
          <button
            className="remove-button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

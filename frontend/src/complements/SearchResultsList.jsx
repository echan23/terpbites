import React from "react";
import { SearchResult } from "./SearchResult";
import "./SearchResultsList.css";

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
          <div>
            <div className="no-results">No results found</div>
            <br />
            <br />
            <span>
              TerpBites doesn't work during the summer because there is nothing
              on the UMD dining hall website, so there is nothing to scrape. In
              the meanwhile, I put some spoof data to show how the app works.
              Try looking for a food with apples in it!
            </span>
            <br />
            <br />
            <span>P.S. UI overhaul coming soon!</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import './SearchResultsList.css';
import { SearchResult } from './SearchResult.jsx';

export const SearchResultsList = ({ results, location }) => {
    return (
        <div className='results-list-wrapper'>
            <div className='results-list'>
                {results.length > 0 ? (
                    results.map((result, id) => (
                        <SearchResult 
                            key={id} 
                            result={result} 
                            location={location}  // Pass the location down to each SearchResult
                        />
                    ))
                ) : (
                    <p className='no-results-placeholder'>No results found</p>
                )}
            </div>
        </div>
    );
};

import React, { useState, useCallback, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState('');
    const [location, setLocation] = useState('');

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearch = async (inputValue, locationValue) => {
        try {
            if (inputValue.trim() === '') {
                setResults([]); // Clear the results if the search bar is empty
                return;
            }
            //let url = `http://localhost:5000/api/food?food_name=${encodeURIComponent(inputValue)}`;
            let url = `http://8.118.205.9:5000/api/food?food_name=${encodeURIComponent(inputValue)}`;
            if (locationValue) {
                url += `&location=${encodeURIComponent(locationValue)}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
            } catch (error) {
            console.error('Error fetching data:', error); // Log the error but do not display it
            setResults([]); // Clear the results on error
            }
        };

        const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

        useEffect(() => {
            if (input) {
            debouncedSearch(input, location);
            }
        }, [input, location, debouncedSearch]);

        return (
            <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                placeholder="Search food..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <select
                name="location-selector"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            >
                <option value="">All Locations</option>
                <option value="North">251 North</option>
                <option value="South">South</option>
                <option value="Y">Yahentamitsi</option>
            </select>
            </div>
        );
};

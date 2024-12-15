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
                setResults([]);
                return;
            }

            //let url = `http://18.219.144.34:5000/api/food?food_name=${encodeURIComponent(inputValue)}`;
            let url = `http://localhost:5000/api/food?food_name=${encodeURIComponent(inputValue)}`;

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
            console.error('Error fetching data:', error);
            setResults([]);
        }
    };

    // Create a debounced version of the search function
    const debouncedSearch = useCallback(debounce(handleSearch, 200), []);

    // useEffect hook to trigger search when input or location changes
    useEffect(() => {
        if (input) {
            debouncedSearch(input, location);
        }
    }, [input, location, debouncedSearch]);

    // Handle input change and clear results immediately before debouncing the search
    const handleInputChange = (e) => {
        setInput(e.target.value);
        setResults([]);
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                placeholder="Search food..."
                value={input}
                onChange={handleInputChange} // Trigger input change handling
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

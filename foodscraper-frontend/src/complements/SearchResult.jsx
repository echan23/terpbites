import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import './SearchBar.css';

export const SearchBar = ({ setResults, setLocation }) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("");

    const handleSearch = async () => {
        try {
            let url = `http://3.147.72.94:5000/api/food?food_name=${encodeURIComponent(input)}`;
            if (selectedLocation) {
                url += `&location=${encodeURIComponent(selectedLocation)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data); // Set results in the parent component
            setError(null); // Reset error if successful
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message); // Set error in state
        }
    };

    const handleChange = (value) => {
        setInput(value); // Update input value
    };

    const handleLocationChange = (e) => {
        const location = e.target.value;
        setSelectedLocation(location);
        setLocation(location); // Optionally pass location to parent
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                placeholder="Search food..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
            <select onChange={handleLocationChange}>
                <option value="">All Locations</option>
                <option value="North">251 North</option>
                <option value="Y">Yahentamitsi</option>
                <option value="South">South</option>
            </select>
            <button onClick={handleSearch}>Search</button> {/* Initiates search */}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

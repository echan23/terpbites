import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import './SearchBar.css';

export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState(null); // State for error handling
    const [location, setLocation] = useState("")

    const fetchData = async (value, location) => {
        try {
            // Fetch data from the API
            let url = `http://localhost:5000/api/food?food_name=${encodeURIComponent(value)}`;
            if (location){
                url += `&location=${encodeURIComponent(location)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
            setError(null);

        } catch (error) {
            console.error('There was an error fetching the data:', error);
            setError(error.message);
        }
    };

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                placeholder="Search food..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
            <select onChange={(e) => setLocation(e.target.value)}>
                <option value="">All Locations</option>
                <option value="North">251 North</option>
                <option value="Y">Yahentamitsi</option>
                <option value="South">South</option>
            </select>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

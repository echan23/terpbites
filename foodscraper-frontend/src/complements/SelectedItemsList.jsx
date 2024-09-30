import React, { useState } from 'react';
import './SelectedItemsList.css';

export const SelectedItemsList = ({ selectedItems, removeItem, updateServings }) => {
    const [expandedItem, setExpandedItem] = useState(null);
    const [inputValues, setInputValues] = useState({});

    const toggleExpand = (itemName) => {
        if (expandedItem === itemName) {
            setExpandedItem(null);
        } else {
            setExpandedItem(itemName);
        }
    };

    const handleInputFocus = (itemName) => {
        setInputValues((prev) => ({...prev, [itemName]: '',}));
    };

    const handleInputChange = (itemName, newValue) => {
        setInputValues((prev) => ({...prev, [itemName]: newValue,}));
    };

    const handleInputBlur = (itemName) => {
        let newValue = inputValues[itemName];
        if (!newValue || Number(newValue) <= 0) {
            newValue = '1'; // Revert to default if input is empty or zero
        }
        setInputValues((prev) => {
            const updatedValues = { ...prev };
            delete updatedValues[itemName];
            return updatedValues;
        });
        updateServings(itemName, newValue); // Update parent state
    };

    return (
        <div className='selected-items-wrapper'>
        <div className="selected-items-container">
            <h3>Selected Items</h3>
            <div className="selected-items-list">
            {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                <div key={item.name} className="selected-item">
                    <div
                    className="selected-item-header"
                    onClick={() => toggleExpand(item.name)}
                    >
                    <span className="item-name">{item.name} ({item.serving_size})</span>
                    <div className="action-container">
                        <div
                        className="serving-input"
                        onClick={(e) => e.stopPropagation()}
                        >
                        <label>Servings:</label>
                        <input
                            type="number"
                            min="1"
                            value={
                            inputValues[item.name] !== undefined
                                ? inputValues[item.name]
                                : item.servings || '1'
                            }
                            onFocus={() => handleInputFocus(item.name)}
                            onChange={(e) => handleInputChange(item.name, e.target.value)}
                            onBlur={() => handleInputBlur(item.name)}
                        />
                        </div>
                        <button
                        className="remove-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeItem(item);
                            setInputValues((prev) => {
                                const updatedValues = { ...prev };
                                delete updatedValues[item.name];
                                return updatedValues;
                            });
                        }}
                        >
                        Remove
                        </button>
                    </div>
                    </div>

                    {expandedItem === item.name && (
                    <div className="nutrition-facts-dropdown">
                        <ul>
                        <li>Calories: {item.calories || 'N/A'}</li>
                        <li>Protein: {item.protein || 'N/A'}</li>
                        <li>Total Fat: {item.total_fat || 'N/A'}</li>
                        <li>Carbs: {item.carbs || 'N/A'}</li>
                        <li>Sodium: {item.sodium || 'N/A'}</li>
                        <li>Sugar: {item.sugar || 'N/A'}</li>
                        <li>Serving Size: {item.serving_size || 'N/A'}</li>
                        </ul>
                    </div>
                    )}
                </div>
                ))
            ) : (
                <div className="no-items">No items selected</div>
            )}
            </div>
        </div>
        </div>
    );
};

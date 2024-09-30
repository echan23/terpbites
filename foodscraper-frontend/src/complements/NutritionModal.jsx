import React from 'react';
import './NutritionModal.css';

export const NutritionModal = ({ selectedItems, closeModal }) => {
  const roundToTwoDecimals = (num) => {
    const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
    return isNaN(rounded) ? "0.00" : rounded.toFixed(1);
  };

  const totalNutrition = selectedItems.reduce((totals, item) => {
    const multiplier = item.servings || 1;
    return {
      calories: (totals.calories || 0) + (parseFloat(item.calories) || 0) * multiplier,
      protein: (totals.protein || 0) + (parseFloat(item.protein) || 0) * multiplier,
      total_fat: (totals.total_fat || 0) + (parseFloat(item.total_fat) || 0) * multiplier,
      carbs: (totals.carbs || 0) + (parseFloat(item.carbs) || 0) * multiplier,
      sodium: (totals.sodium || 0) + (parseFloat(item.sodium) || 0) * multiplier,
      sugar: (totals.sugar || 0) + (parseFloat(item.sugar) || 0) * multiplier,
    };
  }, {
    calories: 0,
    protein: 0,
    total_fat: 0,
    carbs: 0,
    sodium: 0,
    sugar: 0,
  });

  // Apply rounding to two decimal places
  const roundedNutrition = {
    calories: roundToTwoDecimals(totalNutrition.calories),
    protein: roundToTwoDecimals(totalNutrition.protein),
    total_fat: roundToTwoDecimals(totalNutrition.total_fat),
    carbs: roundToTwoDecimals(totalNutrition.carbs),
    sodium: roundToTwoDecimals(totalNutrition.sodium),
    sugar: roundToTwoDecimals(totalNutrition.sugar),
  };

  console.log("Total Nutrition:", totalNutrition);
  console.log("Rounded Nutrition:", roundedNutrition);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Meal Total Nutrition</h3>
        <table>
          <tbody>
            <tr>
              <td>Calories</td>
              <td>{roundedNutrition.calories}</td>
            </tr>
            <tr>
              <td>Protein (g)</td>
              <td>{roundedNutrition.protein}</td>
            </tr>
            <tr>
              <td>Total Fat (g)</td>
              <td>{roundedNutrition.total_fat}</td>
            </tr>
            <tr>
              <td>Carbs (g)</td>
              <td>{roundedNutrition.carbs}</td>
            </tr>
            <tr>
              <td>Sodium (mg)</td>
              <td>{roundedNutrition.sodium}</td>
            </tr>
            <tr>
              <td>Sugar (g)</td>
              <td>{roundedNutrition.sugar}</td>
            </tr>
          </tbody>
        </table>
        <button className="close-button" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

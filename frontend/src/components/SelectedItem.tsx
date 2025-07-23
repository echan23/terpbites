"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Plus, Minus } from "lucide-react";
import type NutritionItem from "@/components/data/NutritionItem";

export interface SelectedItemProps {
  item: NutritionItem;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onChangeServings: (newServings: number) => void;
}

export const SelectedItem: React.FC<SelectedItemProps> = ({
  item,
  isExpanded,
  onToggle,
  onRemove,
  onChangeServings,
}) => {
  const servings = item.servings ?? 1;

  return (
    <div
      className={cn(
        "group relative flex flex-col border rounded-md transition-all duration-200",
        isExpanded ? "p-4 bg-white shadow" : "p-2 bg-gray-100"
      )}
    >
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        {/* Name and serving size */}
        <div className="font-medium flex flex-col">
          <span>{item.name}</span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{item.serving_size ?? "N/A"}</span>
            {item.servings && item.servings > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                x{item.servings}
              </span>
            )}
          </div>
        </div>

        {/*Remove button*/}
        <button
          className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto p-1 text-gray-500 hover:text-red-600 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${item.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="nutrition-facts-panel mt-4 text-gray-800">
          <div className="border-2 border-black p-4 text-xs font-sans leading-tight">
            <div className="border-b-4 border-black pb-1 text-lg font-bold">
              Nutrition Facts
            </div>

            <div className="mt-2 flex justify-between items-center">
              <span className="font-semibold">Serving Size</span>
              <span>{item.serving_size ?? "N/A"}</span>
            </div>
            <div className="border-t border-black my-1" />

            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Servings</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeServings(Math.max(1, servings - 1));
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={servings}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const newValue = Math.max(1, Number(e.target.value));
                    onChangeServings(newValue);
                  }}
                  className="w-12 text-center border border-gray-300 rounded text-xs px-1 py-0.5 focus:outline-none focus:border-blue-500 appearance-none"
                  style={{ MozAppearance: "textfield" }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeServings(servings + 1);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-1">
              <span>Calories</span>
              <span>{item.calories ?? "N/A"}</span>
            </div>
            <div className="border-t border-dashed border-gray-500 mb-2" />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Protein</span>
                <span>{item.protein ?? "N/A"} g</span>
              </div>
              <div className="flex justify-between">
                <span>Total Fat</span>
                <span>{item.total_fat ?? "N/A"} g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbs</span>
                <span>{item.carbs ?? "N/A"} g</span>
              </div>
              <div className="flex justify-between">
                <span>Sodium</span>
                <span>{item.sodium ?? "N/A"} mg</span>
              </div>
              <div className="flex justify-between">
                <span>Sugar</span>
                <span>{item.sugar ?? "N/A"} g</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedItem;

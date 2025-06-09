"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import type NutritionItem from "./data/NutritionItem";

interface NutritionModalProps {
  selectedItems: NutritionItem[];
  closeModal: () => void;
  drawerOpen: boolean;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({
  selectedItems,
  closeModal,
  drawerOpen,
}) => {
  const roundToTwoDecimals = (num: number) => {
    const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
    return isNaN(rounded) ? "0.00" : rounded.toFixed(2);
  };

  const totalNutrition = selectedItems.reduce(
    (totals, item) => {
      const parseField = (field: string | number | undefined) =>
        field ? parseFloat(field as string) || 0 : 0;
      const servings = item.servings ?? 1;
      return {
        calories: totals.calories + parseField(item.calories) * servings,
        protein: totals.protein + parseField(item.protein) * servings,
        total_fat: totals.total_fat + parseField(item.total_fat) * servings,
        carbs: totals.carbs + parseField(item.carbs) * servings,
        sodium: totals.sodium + parseField(item.sodium) * servings,
        sugar: totals.sugar + parseField(item.sugar) * servings,
      };
    },
    { calories: 0, protein: 0, total_fat: 0, carbs: 0, sodium: 0, sugar: 0 }
  );

  const rounded = {
    calories: roundToTwoDecimals(totalNutrition.calories),
    protein: roundToTwoDecimals(totalNutrition.protein),
    total_fat: roundToTwoDecimals(totalNutrition.total_fat),
    carbs: roundToTwoDecimals(totalNutrition.carbs),
    sodium: roundToTwoDecimals(totalNutrition.sodium),
    sugar: roundToTwoDecimals(totalNutrition.sugar),
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={closeModal}>
      <DrawerContent className="w-full max-w-4xl mx-auto my-auto rounded-2xl shadow-xl p-8 bg-white border-4 border-[#E21833]">
        <DrawerHeader>
          <DrawerTitle className="text-3xl font-bold text-black font-serif tracking-wide">
            Total Nutrition
          </DrawerTitle>
          <DrawerDescription className="text-gray-600 mt-1 font-medium">
            Here's your meal summary—Go Terps!
          </DrawerDescription>
        </DrawerHeader>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Big Calorie Card */}
          <div className="flex flex-col items-center justify-center border-2 border-[#FFD200] p-6 rounded-lg shadow-sm">
            <span className="text-black uppercase tracking-wider text-sm font-semibold">
              Calories
            </span>
            <span className="mt-2 text-5xl font-extrabold text-black">
              {rounded.calories}
            </span>
          </div>

          {/* Macronutrient Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Protein", rounded.protein, "g"],
              ["Total Fat", rounded.total_fat, "g"],
              ["Carbs", rounded.carbs, "g"],
              ["Sodium", rounded.sodium, "mg"],
              ["Sugar", rounded.sugar, "g"],
            ].map(([label, value, unit]) => (
              <div
                key={label as string}
                className="flex flex-col items-start bg-white border-2 border-black p-4 rounded-lg shadow-sm"
              >
                <span className="text-[#E21833] text-sm font-semibold uppercase tracking-wide">
                  {label}
                </span>
                <span className="mt-1 text-2xl font-bold text-black">
                  {value} {unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter className="mt-10 flex justify-end">
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={closeModal}
              className="px-8 border-black text-black hover:bg-[#FFD200] hover:text-black font-bold tracking-wide transition-colors duration-300"
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NutritionModal;

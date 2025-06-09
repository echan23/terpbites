import React, { useState, type Dispatch, type SetStateAction } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SelectedItem } from "./SelectedItem";
import type NutritionItem from "./data/NutritionItem";

interface SelectedItemsListProps {
  items: NutritionItem[];
  setSelectedItems: Dispatch<SetStateAction<NutritionItem[]>>;
}

const SelectedItemsList: React.FC<SelectedItemsListProps> = ({
  items,
  setSelectedItems,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleRemove = (itemNameToRemove: string) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.name !== itemNameToRemove)
    );
  };

  const handleChangeServings = (itemName: string, newServings: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, servings: newServings } : item
      )
    );
  };

  return (
    <ScrollArea className="max-h-[60vh] w-full overflow-auto flex flex-col min-h-0">
      {items.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          During the summer, there isn't anything to scrape, so we put some
          spoof data to show how the app works. Try searching for apples!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 p-2 flex-shrink-0">
          {items.map((item, idx) => (
            <SelectedItem
              key={item.name}
              item={item}
              isExpanded={expandedIndex === idx}
              onToggle={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
              onRemove={() => handleRemove(item.name)}
              onChangeServings={(newServings) =>
                handleChangeServings(item.name, newServings)
              }
            />
          ))}
        </div>
      )}
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default SelectedItemsList;

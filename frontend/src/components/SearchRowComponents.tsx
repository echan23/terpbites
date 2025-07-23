import ToggleDrawerButton from "./ToggleDrawerButton";
import LocationSelector from "./LocationSelector";
import Searchbar from "./Searchbar";
import type NutritionItem from "./data/NutritionItem";
import type { Dispatch, SetStateAction } from "react";

interface SearchRowComponentsProps {
  setLocation: (value: string) => void;
  location: string;
  selectedItems: NutritionItem[];
  setSelectedItems: Dispatch<SetStateAction<NutritionItem[]>>;
  toggleDrawer: () => void;
}

const SearchRowComponents = ({
  setLocation,
  location,
  selectedItems,
  setSelectedItems,
  toggleDrawer,
}: SearchRowComponentsProps) => {
  return (
    <div className="searchbar-row-container w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-4">
        <div className="flex sm:contents justify-center gap-5">
          <LocationSelector setLocation={setLocation} />
          <div className="sm:order-3">
            <ToggleDrawerButton onClick={toggleDrawer} />
          </div>
        </div>

        <div className="w-full sm:flex-1 sm:order-2">
          <Searchbar
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            toggleDrawer={toggleDrawer}
            location={location}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchRowComponents;

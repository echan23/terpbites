import { useState } from "react";
import Searchbar from "./components/Searchbar";
import SelectedItemsList from "./components/SelectedItemsList";
import NutritionModal from "./components/NutritionModal";
import type NutritionItem from "./components/data/NutritionItem";
import ToggleDrawerButton from "./components/ToggleDrawerButton";
import LocationSelector from "./components/LocationSelector";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [selectedItems, setSelectedItems] = useState<NutritionItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [location, setLocation] = useState("");

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col md:flex-row justify-center w-full h-full p-2 md:p-5">
        <div className="search-components-container w-full md:w-[70%] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center">
            <div className="w-full sm:w-2/3">
              <LocationSelector setLocation={setLocation} />
            </div>
            <div className="w-full sm:w-1/3">
              <ToggleDrawerButton onClick={toggleDrawer} />
            </div>
          </div>
          <div className="searchbar-row-container flex flex-col md:flex-row justify-between items-center gap-4">
            <Searchbar
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              toggleDrawer={toggleDrawer}
              location={location}
            />
          </div>
          <SelectedItemsList
            items={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
        <NutritionModal
          selectedItems={selectedItems}
          closeModal={toggleDrawer}
          drawerOpen={drawerOpen}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;

import { useState } from "react";
import SelectedItemsList from "./components/SelectedItemsList";
import NutritionModal from "./components/NutritionModal";
import type NutritionItem from "./components/data/NutritionItem";
import SearchRowComponents from "./components/SearchRowComponents";
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

      <main className="flex-1 flex flex-col md:flex-row sm:justify-start md:justify-center w-full p-2 md:p-5 pt-5">
        <div className="search-components-container w-full md:w-[70%] flex flex-col gap-4 max-h-[calc(100vh-120px)] md:max-h-none overflow-y-auto md:overflow-visible">
          <SearchRowComponents
            location={location}
            setLocation={setLocation}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            toggleDrawer={toggleDrawer}
          />
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

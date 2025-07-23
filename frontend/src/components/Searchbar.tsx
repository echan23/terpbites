import { useState, type Dispatch, type SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type NutritionItem from "./data/NutritionItem";

interface SearchbarProps {
  selectedItems: NutritionItem[];
  setSelectedItems: Dispatch<SetStateAction<NutritionItem[]>>;
  toggleDrawer: () => void;
  location: string;
}

const API_BASE = import.meta.env.VITE_SEARCH_API_URL;

const Searchbar = ({ setSelectedItems, location }: SearchbarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<NutritionItem[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    // clear out if no term
    if (!term.trim()) {
      setResults([]);
      return;
    }

    try {
      let url = `${API_BASE}?food_name=${encodeURIComponent(term)}`;
      // include location if selected
      if (location) {
        url += `&location=${encodeURIComponent(location)}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: NutritionItem[] = await res.json();

      //I wrote the query to match results with the search term, i'm too lazy to change it so we'll
      // just show results that start with the search term here
      const prefixResults = data.filter((item) =>
        item.name.toLowerCase().startsWith(term.toLowerCase())
      );
      setResults(prefixResults);
    } catch (err) {
      console.error("Error fetching data:", err);
      setResults([]);
    }
  };

  const handleSelectItem = (item: NutritionItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.name === item.name);
      if (exists) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, servings: (i.servings ?? 1) + 1 } : i
        );
      }
      return [...prev, { ...item, servings: 1 }];
    });

    // reset search
    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="relative flex-1 min-w-0 sm:min-w-64">
      <div className="flex w-full items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a food item…"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full h-14 placeholder:text-sm sm:placeholder:text-base rounded-xl border border-gray-300 px-4 py-3 pl-12 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors duration-200 text-base transform transition-transform duration-200 ease-in-out hover:scale-102 hover:shadow-md"
          />
        </div>
      </div>

      <div
        className={`
    absolute left-0 right-0 z-10 mt-2 rounded-md border border-gray-300 bg-white shadow-md
    overflow-hidden transition-all duration-150 ease-in-out
    ${
      searchTerm && results.length > 0
        ? "max-h-60 opacity-100"
        : "max-h-0 opacity-0"
    }
  `}
      >
        {results.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer px-4 py-3 hover:bg-gray-100 transition-colors"
            onClick={() => handleSelectItem(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Searchbar;

import React, {
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SelectedItem } from "./SelectedItem";
import type NutritionItem from "./data/NutritionItem";

interface SelectedItemsListProps {
  items: NutritionItem[];
  setSelectedItems: Dispatch<SetStateAction<NutritionItem[]>>;
}

interface SwipeableItemProps {
  item: NutritionItem;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onChangeServings: (newServings: number) => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({
  item,
  isExpanded,
  onToggle,
  onRemove,
  onChangeServings,
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSweping, setIsSwiping] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 120; // Minimum distance to trigger delete
  const DELETE_ZONE = 80; // Distance where delete button appears

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSweping) return;

    currentX.current = e.touches[0].clientX;
    const deltaX = startX.current - currentX.current;

    //Only allow left swipe
    if (deltaX > 0) {
      const clampedOffset = Math.min(deltaX, SWIPE_THRESHOLD + 20);
      setSwipeOffset(clampedOffset);
      setShowDeleteButton(clampedOffset > DELETE_ZONE);

      // Prevent scrolling when swiping
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    if (swipeOffset > SWIPE_THRESHOLD) {
      // Delete the item
      onRemove();
    } else {
      // Snap back to original position
      setSwipeOffset(0);
      setShowDeleteButton(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    currentX.current = startX.current;
    setIsSwiping(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isSweping) return;

      currentX.current = e.clientX;
      const deltaX = startX.current - currentX.current;

      if (deltaX > 0) {
        const clampedOffset = Math.min(deltaX, SWIPE_THRESHOLD + 20);
        setSwipeOffset(clampedOffset);
        setShowDeleteButton(clampedOffset > DELETE_ZONE);
      }
    };

    const handleMouseUp = () => {
      setIsSwiping(false);

      if (swipeOffset > SWIPE_THRESHOLD) {
        onRemove();
      } else {
        setSwipeOffset(0);
        setShowDeleteButton(false);
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className={`absolute right-0 top-0 h-full flex items-center justify-center bg-red-500 text-white transition-all duration-200 ${
          showDeleteButton ? "w-20" : "w-0"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>

      <div
        ref={itemRef}
        className={`relative bg-background transition-transform ${
          isSweping ? "duration-0" : "duration-300 ease-out"
        }`}
        style={{
          transform: `translateX(-${swipeOffset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <SelectedItem
          item={item}
          isExpanded={isExpanded}
          onToggle={onToggle}
          onRemove={onRemove}
          onChangeServings={onChangeServings}
        />
      </div>
    </div>
  );
};

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
          <br />
          <br />
          <p className="block sm:hidden">
            Swipe left on an item to remove it from your list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 p-2 flex-shrink-0">
          {items.map((item, idx) => (
            <SwipeableItem
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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

//In the db the locations are stored differently from the labels on the dropdown
const locationMap: { [label: string]: string } = {
  "251 North": "North",
  "South Campus": "South",
  Yahentamitsi: "Y",
};

const LocationSelector = ({
  setLocation,
}: {
  setLocation: (value: string) => void;
}) => (
  <Select
    onValueChange={(selectedLabel) => setLocation(locationMap[selectedLabel])}
  >
    <SelectTrigger
      className="
    relative sm:py-5 md:py-7 px-4 max-w-full sm:w-32 max-w-50 text-sm
    rounded-xl border border-[#E21833] bg-white text-[#E21833] font-medium
    overflow-hidden
    before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1
    before:bg-gradient-to-r before:from-[#E21833] before:via-[#FFD200] before:to-[#E21833]
    before:scale-x-0 before:origin-left before:transition-transform before:duration-300
    transition-colors transition-shadow duration-300 ease-in-out transform
    hover:bg-[#E21833] hover:text-white hover:shadow-md hover:scale-105
    hover:before:scale-x-100
    focus:outline-none focus:ring-2 focus:ring-[#FFD200]/50
  "
    >
      <SelectValue
        placeholder="Location"
        className="py-2 data-[placeholder]:text-white"
      />
    </SelectTrigger>

    <SelectContent
      className="
        mt-2 rounded-xl border border-[#E21833]/50 bg-white
        shadow-md overflow-hidden
      "
    >
      {["251 North", "South Campus", "Yahentamitsi"].map((loc) => (
        <SelectItem
          key={loc}
          value={loc}
          className="
            h-14 px-4 flex items-center
            hover:bg-[#E21833] hover:text-white transition-colors
          "
        >
          {loc}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default LocationSelector;

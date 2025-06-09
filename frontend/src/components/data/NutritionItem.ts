export default interface NutritionItem {
  name: string;
  calories?: number | string;
  protein?: number | string;
  total_fat?: number | string;
  carbs?: number | string;
  sodium?: number | string;
  sugar?: number | string;
  serving_size?: string;
  location?: string;
  servings?: number;
}

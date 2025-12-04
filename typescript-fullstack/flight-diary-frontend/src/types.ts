export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

export interface NewDiaryEntry {
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

export type Weather =
  | "sunny"
  | "rainy"
  | "cloudy"
  | "stormy"
  | "windy"
  | "foggy";

export type Visibility = "great" | "good" | "ok" | "poor";

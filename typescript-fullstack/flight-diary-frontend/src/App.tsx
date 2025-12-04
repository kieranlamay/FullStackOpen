import { useEffect, useState } from "react";
import diaryService from "./services/diaryService";
import type { DiaryEntry, NewDiaryEntry, Weather, Visibility } from "./types";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("great");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [date, setDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    diaryService
      .getDiaries()
      .then((data) => setDiaries(data))
      .catch((error) => {
        console.error("Failed to fetch diaries:", error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDiary: NewDiaryEntry = { date, visibility, weather, comment };
    diaryService
      .addDiary(newDiary)
      .then((addedDiary) => {
        setDiaries(diaries.concat(addedDiary));
        setDate("");
        setVisibility("great");
        setWeather("sunny");
        setComment("");
      })
      .catch((error) => {
        console.error("Failed to add diary:", error);
      });
  };

  return (
    <div>
      <h1>Add a new entry</h1>
      <form onSubmit={handleSubmit}>
        <div>
          Date:{" "}
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          Visibility:
          <select
            name="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
          >
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="ok">Ok</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        <div>
          Weather:
          <select
            name="weather"
            value={weather}
            onChange={(e) => setWeather(e.target.value as Weather)}
          >
            <option value="sunny">Sunny</option>
            <option value="rainy">Rainy</option>
            <option value="cloudy">Cloudy</option>
            <option value="stormy">Stormy</option>
            <option value="windy">Windy</option>
            <option value="foggy">Foggy</option>
          </select>
        </div>
        <div>
          Comment:
          <input
            type="text"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
      <h1>Diary Entries</h1>

      <div>
        {diaries.map((diary) => (
          <div key={diary.id}>
            {" "}
            <h2>{diary.date}</h2> <div>Visibility: {diary.visibility}</div>
            <div>Weather: {diary.weather}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

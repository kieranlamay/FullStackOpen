import { Part } from "./Part";
import type { CoursePart } from "../types";

interface contentProps {
  courseParts: Array<CoursePart>;
}

export const Content = (props: contentProps) => {
  return (
    <div>
      <Part coursePart={props.courseParts[0]}></Part>
      <Part coursePart={props.courseParts[1]}></Part>
      <Part coursePart={props.courseParts[2]}></Part>
      <Part coursePart={props.courseParts[3]}></Part>
      <Part coursePart={props.courseParts[4]}></Part>
      <Part coursePart={props.courseParts[5]}></Part>
    </div>
  );
};

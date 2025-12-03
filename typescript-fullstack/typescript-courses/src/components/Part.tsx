import type { CoursePart } from "../types";

interface PartProps {
  coursePart: CoursePart;
}

export const Part = (props: PartProps) => {
  switch (props.coursePart.kind) {
    case "basic":
      return (
        <div>
          <h3>
            {props.coursePart.name} {props.coursePart.exerciseCount}
          </h3>
          <p>{props.coursePart.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>
            {props.coursePart.name} {props.coursePart.exerciseCount}
          </h3>
          <p>project exercises {props.coursePart.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>
            {props.coursePart.name} {props.coursePart.exerciseCount}
          </h3>
          <p>{props.coursePart.description}</p>
          <p>submit to {props.coursePart.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <h3>
            {props.coursePart.name} {props.coursePart.exerciseCount}
          </h3>
          <p>{props.coursePart.description}</p>
          <p>required skills: {props.coursePart.requirements.join(", ")}</p>
        </div>
      );
    default:
      return <div>Unable to display course part</div>;
  }
};

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase, CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartBase, CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartRequirements extends CoursePartBase, CoursePartDescription {
  requirements: string[];
  kind: "special";
}
export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartRequirements;

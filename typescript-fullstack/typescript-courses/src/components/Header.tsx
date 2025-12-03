interface courseNameProps {
  courseName: string;
}
export const Header = (props : courseNameProps) => {
  return <h1>{props.courseName}</h1>;
};

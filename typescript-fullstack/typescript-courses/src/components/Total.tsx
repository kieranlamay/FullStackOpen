interface totalProps {
  totalExercises: number;
}

export const Total = (props: totalProps) => {
  return <p>Number of exercises {props.totalExercises}</p>;
};

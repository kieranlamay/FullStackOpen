interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArguments = (
  args: string[]
): { dailyExerciseHours: number[]; target: number } => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const dailyExerciseHours: number[] = [];
  for (let i = 3; i < args.length; i++) {
    const hour = Number(args[i]);
    if (isNaN(hour)) {
      throw new Error("Provided values were not numbers!");
    }
    dailyExerciseHours.push(hour);
  }

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error("Provided target value was not a number!");
  }

  return {
    dailyExerciseHours,
    target,
  };
};

export const calculateExercises = (
  dailyExerciseHours: number[],
  target: number
): Result => {
  const average: number =
    dailyExerciseHours.reduce((acc, curr) => acc + curr, 0) /
    dailyExerciseHours.length;

  const trainingDays: number = dailyExerciseHours.filter(
    (dayHours) => dayHours != 0
  ).length;

  let ratingDescription: string = "";
  const rate = (): 1 | 2 | 3 => {
    if (average >= target) {
      ratingDescription = "Great job, you met your target!";
      return 3;
    } else if (average >= target / 2) {
      ratingDescription = "Not too bad but could be better";
      return 2;
    } else {
      ratingDescription = "You need to work harder";
      return 1;
    }
  };

  const rating: 1 | 2 | 3 = rate();

  return {
    periodLength: dailyExerciseHours.length,
    trainingDays: trainingDays,
    success: trainingDays >= target,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: average,
  };
};

if (require.main === module) {
  const { dailyExerciseHours, target } = parseArguments(process.argv);
  console.log(calculateExercises(dailyExerciseHours, target));
}
export default "just satisfy the module system ts";

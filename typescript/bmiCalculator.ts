const parseArguments = (
  args: Array<string>
): { height: number; weight: number } => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Provided values were not numbers!");
  }

  return {
    height,
    weight,
  };
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / height ** 2;
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return "Normal weight";
  } else if (bmi >= 25 && bmi < 29.9) {
    return "Overweight";
  } else {
    return "Obesity";
  }
};

// to differentiate between command line running versus browser
if (require.main === module) {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
}

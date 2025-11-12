import { useState } from "react";

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <div>No feedback given</div>
      </div>
    );
  }
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text="good" value={props.good} />
          <StatisticsLine text="neutral" value={props.neutral} />
          <StatisticsLine text="bad" value={props.bad} />
          <StatisticsLine text="all" value={props.total} />
          <StatisticsLine
            text="average"
            value={props.total > 0 ? (props.value / props.total).toFixed(2) : 0}
          />
          <StatisticsLine
            text="positive"
            value={
              props.total > 0
                ? ((props.good / props.total) * 100).toFixed(2) + " %"
                : "0 %"
            }
          />
        </tbody>
      </table>
    </div>
  );
};

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, updateVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const [total, setTotal] = useState(0);
  const [value, setValue] = useState(0);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button
        text="good"
        handleClick={() => {
          setGood(good + 1);
          setTotal(total + 1);
          setValue(value + 1);
        }}
      />
      <Button
        text="neutral"
        handleClick={() => {
          setNeutral(neutral + 1);
          setTotal(total + 1);
          setValue(value + 0);
        }}
      />
      <Button
        text="bad"
        handleClick={() => {
          setBad(bad + 1);
          setTotal(total + 1);
          setValue(value - 1);
        }}
      />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        value={value}
      />

      <div>Anecdote: {anecdotes[selected]}</div>
      <div>Votes: {votes[selected]}</div>
      <Button
        text="vote"
        handleClick={() => {
          const copy = { ...votes, [selected]: votes[selected] + 1 };
          updateVotes(copy);
        }}
      />
      <Button
        text="Next Anecdote"
        handleClick={() => {
          setSelected(Math.floor(Math.random() * anecdotes.length));
        }}
      />

      <div>Anecdote with most votes</div>
      <div>
        {
          anecdotes[
            Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b))
          ]
        }
      </div>
      <div>
        has{" "}
        {
          votes[
            Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b))
          ]
        }{" "}
        votes
      </div>
    </div>
  );
};

export default App;

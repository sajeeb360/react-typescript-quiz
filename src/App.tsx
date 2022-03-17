import * as React from "react";

//Import function to fetch data from API
import { fetchQuestions, Difficulty, QuestionState } from "./API";

//Imported Components
import QuestionCard from "./components/QuestionCard";

//Imported Styling
import { GlobalStyle, Wrapper } from "./App.styles";

//import loader image
import Loader from "./images/loading.gif";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  correctAnswer: string;
  answer: string;
  correct: boolean;
};

export default function App() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [questions, setQuestions] = React.useState<QuestionState[]>([]);
  const [number, setNumber] = React.useState<number>(0);
  const [gameOver, setGameOver] = React.useState<boolean>(true);
  const [userAnswers, setUserAnswers] = React.useState<AnswerObject[]>([]);
  const [score, setScore] = React.useState<number>(0);
  const [complete, setComplete] = React.useState<boolean>(false);
  const [difficulty, setDifficulty] = React.useState(Difficulty.EASY);

  const startQuiz = async () => {
    setComplete(false);
    setLoading(true);
    const new_questions = await fetchQuestions(TOTAL_QUESTIONS, difficulty);
    setQuestions(new_questions);
    setLoading(false);
    setGameOver(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObject = {
        question: questions[number].question,
        correctAnswer: questions[number].correct_answer,
        answer,
        correct
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const handleNext = () => {
    if (number < TOTAL_QUESTIONS - 1) setNumber((prev) => prev + 1);
    else setComplete(true);
  };

  const handleDifficulty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
  };

  console.log(number);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React Typescript Quiz</h1>
        {complete && <div className="complete">Quiz is complete</div>}

        {gameOver || complete ? (
          <>
            <button className="start" onClick={startQuiz}>
              Start Quiz
            </button>
            <p>Select Difficulty</p>
            <select value={difficulty} onChange={handleDifficulty}>
              {Object.keys(Difficulty).map((key) => (
                <option key={key} value={Difficulty[key]}>
                  {key}
                </option>
              ))}
            </select>
          </>
        ) : null}
        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {loading ? <img src={Loader} alt="loading" /> : null}
        {!loading && !gameOver && !complete && (
          <QuestionCard
            questionNum={number + 1}
            question={questions[number].question}
            answers={questions[number].answers}
            totalQuestions={TOTAL_QUESTIONS}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}

        {!loading && !gameOver && !complete && !!userAnswers[number] && (
          <button className="next" onClick={handleNext}>
            Next Question
          </button>
        )}
      </Wrapper>
    </>
  );
}

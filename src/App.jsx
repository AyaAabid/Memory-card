import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";

function App() {
  const [cards, setCards] = useState([]);
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [firstSelection, setFirstSelection] = useState(null);
  const [secondSelection, setSecondSelection] = useState(null);
  const [cardCount, setCardCount] = useState(4);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const items = [
    { emoji: "🐞", id: "1" },
    { emoji: "🦖", id: "2" },
    { emoji: "🐅", id: "3" },
    { emoji: "🐍", id: "4" },
    { emoji: "🐆", id: "5" },
    { emoji: "🦘", id: "6" },
    { emoji: "🦐", id: "7" },
    { emoji: "🐱", id: "8" },
  ];

  function resetCards() {
    const selectedItems = items.slice(0, cardCount / 2);
    const shuffled = [...selectedItems, ...selectedItems]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        key: Math.random(),
        flipped: false,
        matched: false,
      }));
    setCards(shuffled);
    setMoves(0);
    setTime(0);
    setFirstSelection(null);
    setSecondSelection(null);
    setGameStarted(false);
    setGameFinished(false);
  }

  function handleCardClick(card) {
    if (disabled || !gameStarted) return;

    if (!firstSelection) {
      setFirstSelection(card);
      setCards((prev) =>
        prev.map((c) => (c.key === card.key ? { ...c, flipped: true } : c))
      );
    } else if (!secondSelection && card.key !== firstSelection.key) {
      setSecondSelection(card);
      setCards((prev) =>
        prev.map((c) => (c.key === card.key ? { ...c, flipped: true } : c))
      );
    }
  }

  useEffect(() => {
    if (firstSelection && secondSelection) {
      setDisabled(true);
      if (firstSelection.id === secondSelection.id) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstSelection.id ? { ...c, matched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.key === firstSelection.key || c.key === secondSelection.key
                ? { ...c, flipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  }, [firstSelection, secondSelection]);

  useEffect(() => {
    if (gameStarted && !gameFinished) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameFinished]);

  function resetTurn() {
    setFirstSelection(null);
    setSecondSelection(null);
    setMoves((prev) => prev + 1);
    setDisabled(false);
  }

  function handleNewGameClick() {
    resetCards();
  }

  function handleStartClick() {
    setGameStarted(true);
    setGameFinished(false);
  }

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setGameFinished(true);
      setGameStarted(false);
    }
  }, [cards]);

  useEffect(() => {
    resetCards();
  }, [cardCount]);

  return (
    <div className="app">
      <div className="controls">
        <select
          className="card-select"
          onChange={(e) => setCardCount(Number(e.target.value))}
        >
          <option value="4">4 Cards</option>
          <option value="8">8 Cards</option>
          <option value="16">16 Cards</option>
        </select>
        <button onClick={handleNewGameClick} className="new-game-button">
          New Game
        </button>
        <button onClick={handleStartClick} className="start-button">
          Start
        </button>
      </div>
      <div className={`game-board cards-${cardCount}`}>
        {cards.map((card) => (
          <Card
            key={card.key}
            card={card}
            handleCardClick={() => handleCardClick(card)}
            disabled={disabled || card.flipped || card.matched}
          />
        ))}
      </div>
      <div className="stats">
        <div>
          Moves: <span>{moves}</span>
        </div>
        <div>
          Time: <span>{time}s</span>
        </div>
      </div>
      {gameFinished && (
        <div className="popup">
          <div className="popup-content">
            <h2>You Won!</h2>
            <p>Moves: {moves}</p>
            <p>Time: {time}s</p>
            <button onClick={handleNewGameClick} className="new-game-button">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

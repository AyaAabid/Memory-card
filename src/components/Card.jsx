import bg from "../assets/bg.svg";
import "./Card.css";

const Card = ({ card, handleCardClick, disabled }) => {
  return (
    <div
      className={`card ${card.flipped ? "flipped" : ""} ${
        card.matched ? "matched" : ""
      }`}
      onClick={disabled ? undefined : handleCardClick}
    >
      <div className="side front">
        <img src={bg} alt="bg" />
      </div>

      <div className="side back">{card.emoji}</div>
    </div>
  );
};

export default Card;

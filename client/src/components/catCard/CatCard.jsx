import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ card }) {
  return (
    <Link to={`/gigs?cat=${card.title.toLowerCase().replace(/ /g, "_")}`}>
      <div className="catCard">
        <img src={card.img} alt="/catCard" />
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </Link>
  );
}
export default CatCard;

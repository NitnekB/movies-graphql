import React from 'react';

import './MovieItem.css';

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faVideo } from "@fortawesome/free-solid-svg-icons";

const movieItem = props => (
  <li key={props.movieId} className="movies_list-item">
    <div>
      <h2>{props.title}</h2>
      <h3>{props.year}</h3>
    </div>
    <div>
      <h4>Created by: {props.creator.pseudo}</h4>
    </div>
    <div>
      <button className="btn icon"><FontAwesomeIcon icon={faVideo} /></button>
      <button className="btn icon"><FontAwesomeIcon icon={faThumbsDown} /></button>
      <button className="btn icon"><FontAwesomeIcon icon={faThumbsUp} /></button>
    </div>
  </li>
)

export default movieItem;

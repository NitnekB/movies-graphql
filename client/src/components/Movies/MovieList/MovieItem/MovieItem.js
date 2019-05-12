import React from 'react';

import './MovieItem.css';

const movieItem = props => (
  <li key={props.movieId} className="movies_list-item">
    <div>
      <h2>{props.title}</h2>
      <h3>{props.year}</h3>
    </div>
    <div>
      <h4>Created by: {props.creator.email}</h4>
    </div>
    <div>
      <button className="btn">View Details</button>
      <button className="btn">Rate!</button>
    </div>
  </li>
)

export default movieItem;

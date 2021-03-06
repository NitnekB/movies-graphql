import React from 'react';

import './Modal.css';

const modal = props => (
  <div className="modal">
    <header className="modal_header">
      <h2>{props.title}</h2>
    </header>
    <section className="modal_content">
      {props.children}
    </section>
    <section className="modal_actions">
      {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
      {props.canConfirm && <button className="btn" onClick={props.onConfirm}>Confirm</button>}
    </section>
  </div>
);

export default modal;

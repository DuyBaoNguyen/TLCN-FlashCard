import React from 'react';

import './Filter.css';

const filter = props => {
  const classes = ['filter'];
  if (props.className) {
    classes.push(props.className);
  }

  return (
    <select
      className={classes.join(' ')}
      name={props.name}
      value={props.value}
      onChange={props.onChange}>
      {props.children}
    </select>
  );
};

export default filter;
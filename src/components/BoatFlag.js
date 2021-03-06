import React, { useEffect } from "react";
import _ from 'lodash'
import anime from 'animejs'

const getTop = (position) => {
  const topString = _.get(position, 'top', '0')
  const regex = /[0-9]+/ig
  const [top] = regex.exec(topString)
  return `${top - 100}px`
}

const getLeft = (position) => {
  const topString = _.get(position, 'left', '0')
  const regex = /[0-9]+/ig
  const [left] = regex.exec(topString)
  // return `${50}px`
  return `${left}px`
}

const BoatFlag = ({ show = false, boat = {}, position }) => {
  const { author = '', message = '', category = '' } = boat
  const top = getTop(position);
  const left = getLeft(position);
  const text = `"I regret ${message}"`;

  useEffect(() => {
    anime({
      targets: '.boat-flag',
      opacity: 1,
      width: '500px',
      duration: 1000,
      easing: 'easeInOutQuad'
    })
  }, [])

  return (
    <div className={`boat-flag ${show ? 'show' : ''} ${category}`} style={{ top, left }}>
      <div className="text">{text}</div>
      <div className="author">{author}</div>
    </div>
  );
};

export default BoatFlag
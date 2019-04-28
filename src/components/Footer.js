import React from 'react'
import { Link } from 'react-router-dom'
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

// import iconFB from '../images/icon_fb.png'
// import iconTwitter from '../images/icon_twitter.png'
import iconLogout from '../images/logout.png'

const url = "https://thatship.netlify.com"
const title = 'that ship has sailed.'

const Footer = () => {
  return (
    <div className="footer">
      <div className="link-list">
        <a href="#">
          <FacebookShareButton
            url={url}
            quote={title}
            className="Demo__some-network__share-button">
            <FacebookIcon size={20} round={true} />
          </FacebookShareButton>
        </a>
        <a href="#">
          <TwitterShareButton
            url={url}
            title={title}
            className="Demo__some-network__share-button">
            <TwitterIcon size={20} round={true} />
          </TwitterShareButton>
        </a>
        <Link to="/about"><p>About</p></Link>
        <Link to="/credit"><p>Credit</p></Link>
        <Link to="/terms"><p>Term & Condition</p></Link>
      </div>
      <button className="button-logout"><img src={iconLogout} alt="" /></button>
    </div>
  )
}

export default Footer
import React, { useState } from 'react'
import { useMain } from '../../helpers/context/main-context';
import './Video.css';
import {BiDotsVerticalRounded} from '../../utils/getIcons';
import {VideoOptions} from '../../comps/index';
import { historyVideoService } from '../../helpers/services/historyVideoService';
import { useLocation } from 'react-router-dom';

               
function Video({video, thumbnail, title, channel, timesAgo, timeLength, views}) {
    const {hideMenu, dispatch, userLoggedIn, incognito} = useMain();
    const [showOptions, setShowOptions] = useState(false);

    let {pathname} = useLocation();

    const videoHandler = () => {
       if(userLoggedIn) {
          if(!incognito) {
              pathname === "/" && historyVideoService(dispatch, video);
          }
       }
    }

  return (
    <div className={hideMenu ? 'video-container big flex-centered' : 'video-container flex-centered'}>
        <div className="video-header cursor-pointer" onClick={videoHandler}>
            <img src={thumbnail} className="video-thumbnail" alt="video-thumbnail" />
            <span className="time-length">{timeLength}</span>
        </div>
        <div className="video-footer">
            <div className="video-footer-top flex-centered">
                <img src='https://i.pravatar.cc/32?img=3' className="channel-image" alt="creator-image" />
                <h4 className="video-title flex-centered">{title}</h4>
                <BiDotsVerticalRounded className='video-icon-dots cursor-pointer' size="1.5em"onClick={() => setShowOptions(prev => !prev)}/>
            </div>
            <div className="video-footer-bottom flex-centered">
                <p className="channel-name">{channel}</p>
                <p className="video-views">{views} • {timesAgo}</p>
            </div>
        </div>
        {showOptions && <VideoOptions video={video} />}
    </div>
  )
}

export {Video}
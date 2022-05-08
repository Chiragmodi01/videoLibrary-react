import React, { useState } from 'react'
import './VideoOptions.css';
import {AiOutlineClockCircle, CgPlayListAdd, BiShare, AiOutlineHistory} from '../../utils/getIcons';
import { useLocation, useNavigate } from 'react-router-dom';
import { watchLaterService } from '../../helpers/services/watchLaterService';
import { deleteWatchlaterVideo } from '../../helpers/services/deleteWatchlaterVideo';
import { deleteFromHistoryService } from '../../helpers/services/deleteFromHistoryService';
import { useMain } from '../../helpers/context/main-context';
import { findVideo } from '../../utils/findVideo';
import {PlaylistsModal} from '../../comps';

function VideoOptions({video}) {
    const {state, dispatch, userLoggedIn, showPlaylistModal, setShowPlaylistModal} = useMain();
    let {pathname} = useLocation();
    let navigate = useNavigate();

    const isVideoInWatchlater = findVideo(video._id, state.watchlater) ? true : false;

    const saveToWatchlater = () => {
       if(userLoggedIn) {
        watchLaterService(dispatch, video)
       } else {
        navigate('/signup');
       }
    }

    const deleteFromWatchlater = () => {
        deleteWatchlaterVideo(dispatch, video)
    }

    const deleteFromHistory = () => {
        deleteFromHistoryService(dispatch, video)
    }

    

  return (
    <div className='videoOptions'>
       { pathname === "/history" && <ul className="videoOptions-menu cursor-pointer" onClick={deleteFromHistory}>
            <AiOutlineHistory className='icon-share-flip' size="1.5em" />
            <li className="videoOptions-menu-item">Remove from history</li>
        </ul>}
        <ul className="videoOptions-menu cursor-pointer" onClick={isVideoInWatchlater ? deleteFromWatchlater : saveToWatchlater}>
            <AiOutlineClockCircle size="1.5em" />
            <li className="videoOptions-menu-item">{isVideoInWatchlater ? 'Remove from Watch later' : 'Save to Watch later'}</li>
        </ul>
        <ul className="videoOptions-menu cursor-pointer" onClick={() => setShowPlaylistModal(prev => !prev)}>
            <CgPlayListAdd size="1.5em" />
            <li className="videoOptions-menu-item">Save to playlist</li>
        </ul>
        <ul className="videoOptions-menu cursor-pointer">
            <BiShare className='icon-share-flip' size="1.5em" />
            <li className="videoOptions-menu-item">Share</li>
        </ul>
        {userLoggedIn ?
        showPlaylistModal && <PlaylistsModal /> : 
        navigate("/signup")
        }
    </div>
  )
}

export {VideoOptions}
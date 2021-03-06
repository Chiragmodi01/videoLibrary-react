import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useMain } from '../../helpers/context/main-context';
import './SinglePageVideo.css';
import {RiThumbUpFill, RiThumbUpLine, BiShare, AiOutlineClockCircle, CgPlayListAdd} from '../../utils/getIcons';
import { watchLaterService } from '../../helpers/services/watchLaterService';
import { likeVideoService } from '../../helpers/services/likeVideoService';
import { removeLikeVideoService } from '../../helpers/services/removeLikeVideoService';
import { deleteWatchlaterVideo } from '../../helpers/services/deleteWatchlaterVideo';
import { findVideo, findVideoInLiked } from '../../utils/findVideo';
import { PlaylistsModal } from '../../comps';
import { toast } from 'react-toastify';
import axios from 'axios';

function SinglePageVideo() {
    const {videoId} = useParams();  
    
    const {state: {videos, watchlater, liked}, utilsState: {userLoggedIn, showPlaylistModal}, dispatch, utilsDispatch} = useMain();
    let navigate = useNavigate();
    const [singleVideoFetchRes, setSingleVideoFetchRes] = useState('');

    const findCurrentVideo = videos.find((video) => video._id === videoId);
    const isVideoInWatchlater = findVideo(videoId, watchlater) ? true : false;
    const isVideoInLiked = findVideoInLiked(liked, videoId) ? true : false;

    const IconLike = isVideoInLiked ? RiThumbUpFill : RiThumbUpLine;

    const saveToWatchlater = () => {
        if(userLoggedIn) {
         watchLaterService(dispatch, findCurrentVideo)
        } else {
         navigate('/signup');
        }
     }

     const deleteFromWatchlater = () => {
        deleteWatchlaterVideo(dispatch, findCurrentVideo)
    }

    const likeVideoHandler = () => {
        if(userLoggedIn) {
            likeVideoService(dispatch, findCurrentVideo);
            toast.success('Video added to liked');
        } else {
            navigate('/signup');
        }
    }

    const removeLikeHandler = () => {
        removeLikeVideoService(dispatch, findCurrentVideo);
        toast.success('Video remove from liked');
    }

    const playlistOptionHandler = () => {
        userLoggedIn ? utilsDispatch({type: "SHOW_PLAYLIST_MODAL", payload: !showPlaylistModal}) : navigate("/signup")
    }

    const copyCurrentHref = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
        utilsDispatch({type: "TOAST_DELAY", payload: 1500});
    }

    const fetchSingleVideo = async ()=> {
        try {
            const res = await axios.get(`/api/video/${videoId}`)
            setSingleVideoFetchRes(res.data.video);
        } catch (e) {
            console.error(e);
            navigate('404')
        }
    }

    useEffect(() => {
        fetchSingleVideo();
    }, []);
    console.log(singleVideoFetchRes)

  return (
    <div className='SinglePageVideo'>
        <div className="videoPage-iframe-wrapper">
            <iframe className='videoPage-iframe' src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        <div className='videoPage-info-main'>
            <div className="videoPage-info-wrapper">
                <div className="videoPage-info-head">
                    <h2 className="videoPage-video-title">{singleVideoFetchRes.title}</h2>
                </div>
                <div className="videoPage-info-bottom flex align-center justify-start">
                    <div className='videoPage-info-bottom-first'>
                        <p className="videoPage-video-views">{singleVideoFetchRes.views} ??? {singleVideoFetchRes.timesAgo}</p>
                    </div>
                    <div className='videoPage-info-actions flex'>
                        <span title="I like this" onClick={isVideoInLiked ? removeLikeHandler : likeVideoHandler}>
                            <IconLike size="1.5em"/>
                            <p>{isVideoInLiked ? 'Liked' : 'Like'}</p>
                        </span>
                        <span title="Share" onClick={copyCurrentHref}>
                            <BiShare size="1.5em"/>
                            <p>Share</p>
                        </span>
                        <span title="Add to Watch later" onClick={isVideoInWatchlater ? deleteFromWatchlater : saveToWatchlater}>
                            <AiOutlineClockCircle size="1.5em"/>
                            <p>{isVideoInWatchlater ? 'Remove from Watch later' : 'Add to Watch later'}</p>
                        </span>
                        <span title="Save to playlist" onClick={() => playlistOptionHandler()}>
                            <CgPlayListAdd size="1.5em"/>
                            <p>Save</p>
                        </span>
                    </div>
                </div>
                <div className="videoPage-info-desc">
                    <h2 className="videoPage-video-desc">{singleVideoFetchRes.description}</h2>
                </div>
            </div>
            <div className="videoPage-left-main">
                <div className="videoPage-channel-wrapper">
                    <div className='videoPage-channel-info-wrapper flex-centered flex-row'>
                        <div className="videoPage-channel-img-container">
                            <img src={`https://yt3.ggpht.com/ytc/${singleVideoFetchRes.channelImg}=s48-c-k-c0x00ffffff-no-rj`} alt="channel-image" className="videoPage-channel-image" />
                        </div>
                        <div className="videoPage-channel-info-container">
                            <h3 className="videoPage-channel-name">{singleVideoFetchRes.channel}</h3>
                            <h3 className="videoPage-channel-subs">{singleVideoFetchRes.subscribers} subscribers</h3>
                        </div>
                    </div>
                    <div className="videoPage-channel-btn-sub">Subscribe</div>
                </div>
            
                <div className="videoPage-channel-desc-wrapper flex-centered flex-col">
                    <h2 className="videoPage-channel-desc-item">Joined {singleVideoFetchRes.channelJoined}</h2>
                    <h2 className="videoPage-channel-desc-item">{singleVideoFetchRes.channelViews} views</h2>
                </div>
            </div>
        </div>
        { showPlaylistModal && <PlaylistsModal video={singleVideoFetchRes} /> }
    </div>
  )
}

export {SinglePageVideo}
import React, { useMemo, useState, useEffect } from 'react'
import videojs from 'video.js'

import 'video.js/dist/video-js.css'

const Player = (props) => {
    const [videoNode, setVideoNode] = useState()
    const [player, setPlayer] = useState()

    const url = "http://172.20.10.2:8088/car_stream.m3u8"
    
    useMemo (() => {
        if (videoNode) {
            const videoJsOptions = {
                autoplay: true, 
                language: 'zh-CN',
                preload: 'auto',
                errorDisplay: true,
                width: 475,
                height: 300,
                flash: {
                    swf: '/video-js.swf',
                },
                sources: [
                    {
                        src: url,
                        type: "rtmp/flv"
                    },
                ],
            }
            const videoPlayer = videojs(videoNode, videoJsOptions)
            setPlayer(videoPlayer)
        }
    }, [videoNode]);

    useEffect(() => {
        return (() => {
            if (player) player.dispose()
        })
    },[])
    
    return(
        <>
            <div style={{margin:50}}>
                <video
                    ref={(node) => {
                        setVideoNode (node)
                    }}
                    id="videoPlay"
                    className="video-js vjs-default-skin vjs-big-play-centered"
                    width="100%"
                    height="100%"
                >
                    <track kind="captions" />
                    <p className="vjs-no-js">您的瀏覽器</p>
                </video> 
            </div>
        </>
    )
}

export default Player;

                
import { useState } from 'react'
import ReactPlayer from 'react-player'
import ReactHLS from 'react-hls'
import ReactHlsPlayer from 'react-hls-player'
import Title from "../Components/Title"
import Screen from "../Components/Screen"
import {Button} from 'antd'
import axios from "../api"
import Player from '../Components/Player'
import VideoPlayer from '../Components/VideoPlayer'
import 'video.js/dist/video-js.min.css'
import HLSPlayer from '../Components/HLSPlayer'

const client = new WebSocket('ws://localhost:4000')

const Door = ({door, setDoor, displayStatus, host}) => {
    const [open, setOpen] = useState(false)
    
    const control = async (command) => {
        const {
            data: { msg },
        } = await axios.post('/api/door/control', {
            door,
            command
        })
    }

    client.onmessage = (byteString) => {
        const { data } = byteString;
        const [topic, payload] = JSON.parse(data);    
        if (topic=='QRcode') {
            displayStatus({
                type: 'info',
                msg: payload
            }, 3)
        }
    }

    return (
        <>
            <Title>
                <h1>{door}</h1>
            </Title>
            <div style={{display:"flex"}}>
                <Screen style={{height:400}}>
                    {/*<p style={{marginTop:190}}>video from {door}</p>*/}
                    {/*<Image/>*/}
                    {/*<Player/>*/}
                    {/*<div style={{width:525, height:350, marginTop:25, marginLeft:40}}>
                        <ReactPlayer url='rtmp://172.20.10.2:1935/live/test' width = '525px' height = '350px' />
                    </div>*/}
                    {/*<ReactHLS 
                        url={"rtmp://172.20.10.2:1935/live/test"}
                        autoplay='true'
                    />*/}
                    <HLSPlayer src={`http://${host}:8088/door_stream.m3u8`}/>
                    {/*<video 
                        style={{width:"50vw",height:"50vh",margin:"0 auto"}} 
                        id="my-video" 
                        className="video-js vjs-default-skin"
                    >
                    </video>*/}
                    {/*<VLCPlayer
                        style={[styles.video]}
                        videoAspectRatio="16:9"
                        source={{ uri: "https://www.radiantmediaplayer.com/media/big-buck-bunny-360p.mp4"}}
                    />*/}
                    {/*<VlcPlayer
                        ref={this.vlcplayer}
                        style={{
                            width: 300,
                            height: 200,
                        }}
                        paused={false}
                        autoplay={true}
                        source={{
                            uri: 'file:///storage/emulated/0/Download/example.mp4',
                            autoplay: true,
                            initOptions: ['--codec=avcodec'],
                        }}  />*/}
                    {/*<VideoPlayer src={'rtmp://172.20.10.2:1935/live/city'} ></VideoPlayer>*/}
                </Screen>
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:50}}>
                    {open?
                        <Button type="primary" shape="round" onClick={()=>{
                            control('close')
                            setOpen(false)
                            }} style={{margin:10}}>
                            Close
                        </Button>:
                        <Button type="primary" shape="round" onClick={()=>{
                            control('open')
                            setOpen(true)
                            }} style={{margin:10}}>
                            Open
                        </Button>
                    }
                </div>
            </div>
            <Button type="primary" onClick={()=>setDoor('')}>
                Back
            </Button>
        </>
    )
}

export default Door
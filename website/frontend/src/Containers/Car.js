import { useState } from 'react'
import Title from "../Components/Title"
import Screen from "../Components/Screen"
import {Button} from 'antd'
import {UpCircleOutlined, DownCircleOutlined, LeftCircleOutlined, RightCircleOutlined} from '@ant-design/icons'
import axios from "../api"
import Player from '../Components/Player'
import ReactHlsPlayer from 'react-hls-player'
import HLSPlayer from '../Components/HLSPlayer'
import './icon.css'

const client = new WebSocket('ws://localhost:4000')

const Car = ({car, setCar, displayStatus, host}) => {
    const [open, setOpen] = useState(false)
    
    const control = async (command) => {
        const {
            data: { msg },
        } = await axios.post('/api/car/control', {
            car,
            command,
        })
    }
    
    client.onmessage = (byteString) => {
        const { data } = byteString;
        const [topic, payload] = JSON.parse(data);
        if (topic=='Face') {
            displayStatus({
                type: 'info',
                msg: payload
            }, 3)
        }
    }

    return (
        <>
            <Title>
                <h1>{car}</h1>
            </Title>
            <div style={{display:"flex"}}>
                <Screen style={{height:400}}>
                    {/*<p style={{marginTop:190}}>video from {car}</p>*/}
                    <HLSPlayer src={`http://${host}:8088/car_stream.m3u8`}/>
                </Screen>
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:50}}>
                    <div>
                        <UpCircleOutlined className='icon' style={{fontSize: 50, margin:2, cursor:"pointer"}} onMouseDown={()=>control("forward")} onMouseUp={()=>control("stop")}/>
                    </div>
                    <div>
                        <LeftCircleOutlined className='icon' style={{fontSize: 50, margin:2, cursor:"pointer"}} onMouseDown={()=>control("left")} onMouseUp={()=>control("stop")}/>
                        <DownCircleOutlined className='icon' style={{fontSize: 50, margin:2, cursor:"pointer"}} onMouseDown={()=>control("backward")} onMouseUp={()=>control("stop")}/>
                        <RightCircleOutlined className='icon' style={{fontSize: 50, margin:2, cursor:"pointer"}} onMouseDown={()=>control("right")} onMouseUp={()=>control("stop")}/>
                    </div>
                    <div>
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
            </div>
            <Button type="primary" onClick={()=>setCar('')} style={{margin:10}}>
                Back
            </Button>
        </>
    )
}

export default Car
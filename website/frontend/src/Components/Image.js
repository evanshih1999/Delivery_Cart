import { useState } from "react";

const client = new WebSocket('ws://localhost:4000')

const Image = () => {
    const [imgsrc, setImgsrc] = useState('https://th.bing.com/th/id/R.4eb4f24e167154d4a90ce57f92f14dd6?rik=lFZopRjR3WfKGA&riu=http%3a%2f%2fgetdrawings.com%2ffree-icon-bw%2fno-internet-connection-icon-12.png&ehk=iOI013xTWlfbJaIhg7qUvNxouOqmr4%2fQbUDWcYcoxIE%3d&risl=&pid=ImgRaw&r=0')
    const getImage = () => {
        client.send(JSON.stringify({ info: 'getImage' }))
    }
    client.onmessage = (byteString) => {
        const { data } = byteString
        const info = JSON.parse(data)
        if (info.image) {
            setImgsrc('data:image/jpeg;base64,' + info.buffer)
        }
    }
    return (
        <img src={imgsrc} style={{height:360, width:480, margin:20}} onClick={getImage}></img>
    )
}

export default Image
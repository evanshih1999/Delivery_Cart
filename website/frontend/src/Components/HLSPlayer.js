import ReactHlsPlayer from 'react-hls-player'

const HLSPlayer = ({src}) => {
    return(
        <div style={{marginTop:50}}>
            <ReactHlsPlayer
                src={src}
                autoPlay={false}
                controls={true}
                width="90%"
                height="auto"
            />
        </div>
    )
}

export default HLSPlayer
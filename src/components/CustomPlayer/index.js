import {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import Player from 'xgplayer'

const DefaultPlayOptions = {
    videoInit: true, // 初始化显示视频首帧
    volume: 0.8, // 默认音量
    autoplay: true, // 自动播放
    download: true, // 视频下载
    fluid: true, // 放器宽度跟随父元素的宽度大小变化
    playbackRate: [0.5, 0.75, 1, 1.5, 2], // 倍速播放
    defaultPlaybackRate: 1, // 初始播放速度
    rotate: {   // 视频旋转按钮配置项
        innerRotate: true, // 只旋转内部video
        clockwise: true, // 旋转方向是否为顺时针
    },
    screenShot: { // 截图，默认为 .png 格式
        saveImg: true,
        quality: 1,
    },
    pip: true, //打开画中画功能
    definitionActive: 'click', // 清晰度切换配置
}

function CustomPlayer(props) {
    const {urls = []} = props

    const playerWrapRef = useRef()
    const playerRef = useRef()

    useEffect(() => {
        if (urls?.length) {
            if (playerRef.current) {
                playerRef.current.destroy(playerWrapRef.current)
            }
            playerRef.current = new Player({
                el: playerWrapRef.current,
                url: urls[urls.length - 1].url,
                ...DefaultPlayOptions,
            })
            if(urls.length > 1) {
                // 清晰度切换配置
                playerRef.current.emit('resourceReady', urls)
            }
        }
    }, [urls])

    return (
        <div ref={playerWrapRef}/>
    )
}

CustomPlayer.propTypes = {
    urls: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
    }))
}

export default CustomPlayer

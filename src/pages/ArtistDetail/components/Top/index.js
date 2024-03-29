/**
 * 热门作品
 */
import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import { PLAY_TYPE } from 'constants/music'
import { requestArtistTop } from 'services/artist'
import { parseSongs } from 'utils/song'
import SongList from './components/SongList'

import styles from './index.scss'

function Top(props) {
  const { artistId } = props

  const [loading, setLoading] = useState(false)
  const [songs, setSongs] = useState([])
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true)
        const res = await requestArtistTop({ id: artistId })
        if (isMounted.current) {
          setSongs(parseSongs(res?.songs || []))
        }
      } catch (e) {
        console.log(e)
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }

    fetchSongs()
  }, [artistId])

  return (
    <>
      {songs.length ? (
        <div className={styles.actions}>
          <div className="fl">
            <Play type={PLAY_TYPE.PLAYLIST.TYPE} songs={songs}>
              <a href={null} className={styles['btn-play']} title="播放">
                <PlayCircleOutlineIcon />
                <span>播放</span>
              </a>
            </Play>
            <Add type={PLAY_TYPE.PLAYLIST.TYPE} songs={songs}>
              <a
                href={null}
                className={styles['btn-add-play']}
                title="添加到播放列表"
              >
                <AddIcon />
              </a>
            </Add>
          </div>
          <div className="fr" />
        </div>
      ) : null}
      <SongList loading={loading} songs={songs} />
    </>
  )
}

Top.propTypes = {
  artistId: PropTypes.number.isRequired
}

export default Top

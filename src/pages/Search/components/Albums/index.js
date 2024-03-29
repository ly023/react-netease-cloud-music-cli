import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { DEFAULT_ARTIST_AVATAR } from 'constants'
import { PLAY_TYPE } from 'constants/music'
import Play from 'components/business/Play'
import { getThumbnail } from 'utils'
import { getRenderKeyword } from 'utils/song'

import styles from './index.scss'

function Albums(props) {
  const { keyword = '', list = [] } = props
  return (
    <ul className={styles.list}>
      {list.map((item) => {
        const { id, name, artists } = item
        const albumUrl = `/album/${id}`
        return (
          <li key={id} className={styles.item}>
            <div className={styles.cover}>
              <Link to={albumUrl}>
                <img
                  src={getThumbnail(item.picUrl)}
                  onError={(e) => {
                    e.target.src = DEFAULT_ARTIST_AVATAR
                  }}
                  alt="封面"
                />
                <div className={styles.mask} />
              </Link>
              <Play id={id} type={PLAY_TYPE.ALBUM.TYPE}>
                <span title="播放" className={styles['play-icon']} />
              </Play>
            </div>
            <p className={styles.desc}>
              <Link to={albumUrl}>{getRenderKeyword(name, keyword)}</Link>
            </p>
            <p className={styles.name}>
              {Array.isArray(artists) &&
                artists.map((artist, i) => {
                  const artistName = artist.name
                  return (
                    <span key={`${artist.id}-${i}`}>
                      <Link to={`/artist/${artist.id}`}>
                        {getRenderKeyword(artistName, keyword)}
                      </Link>
                      {i !== artists.length - 1 ? ' / ' : ''}
                    </span>
                  )
                })}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

Albums.propTypes = {
  keyword: PropTypes.string,
  list: PropTypes.array
}

export default memo(Albums)

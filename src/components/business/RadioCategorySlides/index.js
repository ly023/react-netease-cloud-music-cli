import { useState, useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { DEFAULT_DOCUMENT_TITLE } from 'constants'
import { requestCategories } from 'services/radio'

import styles from './index.scss'

const PER_SLIDES = 18

function RadioCategorySlides(props) {
  const { categoryId } = props

  const [categories, setCategories] = useState([])
  const [slides, setSlides] = useState([])
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [pagination, setPagination] = useState([])
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    const fetchCategories = async () => {
      const res = await requestCategories()
      if (isMounted.current) {
        setCategories(res.categories)
      }
    }

    fetchCategories()

    return () => {
      isMounted.current = false
    }
  }, [])

  const slide = useCallback(
    (index) => {
      const currentSlides = categories.slice(
        index * PER_SLIDES,
        (index + 1) * PER_SLIDES
      )
      const page = Math.ceil(categories.length / PER_SLIDES)

      setActivePageIndex(index)
      setSlides(currentSlides)
      setPagination(Array.from(new Array(page)))
    },
    [categories]
  )

  const handlePrev = () => {
    if (activePageIndex === 0) {
      return
    }
    const prevIndex = activePageIndex - 1
    slide(prevIndex)
  }

  const handleNext = () => {
    if (activePageIndex === pagination.length - 1) {
      return
    }
    const nextIndex = activePageIndex + 1
    slide(nextIndex)
  }

  const handlePageChange = (index) => {
    slide(index)
  }

  useEffect(() => {
    let pageIndex = 0
    if (categoryId) {
      const index = categories.findIndex((v) => v.id === categoryId)
      if (index !== -1) {
        pageIndex = Math.floor(index / PER_SLIDES)
        // 修改 document title
        const categoryName = categories[index].name
        document.title = `${categoryName} - 主播电台 - ${DEFAULT_DOCUMENT_TITLE}`
      }
    }
    slide(pageIndex)
  }, [categoryId, categories, slide])

  return (
    <div className={styles.categories}>
      <div className={styles.list}>
        {slides.map((item) => {
          const { id, name } = item
          const categoryLink = `/discover/radio/category/${id}`
          return (
            <Link
              key={id}
              to={categoryLink}
              className={`${styles.item} ${categoryId === id ? styles.active : ''}`}
            >
              <div
                className={styles.icon}
                style={{ backgroundImage: `url(${item.picWebUrl})` }}
              />
              <em className={styles.name}>{name}</em>
            </Link>
          )
        })}
      </div>
      <div className={styles.pagination}>
        {pagination.map((v, index) => {
          return (
            <span
              key={index}
              className={`${styles.dot} ${index === activePageIndex ? styles.active : ''}`}
              onClick={() => handlePageChange(index)}
            />
          )
        })}
      </div>
      <div
        className={`${styles.prev} ${activePageIndex === 0 ? styles.disabled : ''}`}
        onClick={handlePrev}
      />
      <div
        className={`${styles.next} ${activePageIndex === pagination.length - 1 ? styles.disabled : ''}`}
        onClick={handleNext}
      />
    </div>
  )
}

PropTypes.propTypes = {
  categoryId: PropTypes.number
}

export default RadioCategorySlides

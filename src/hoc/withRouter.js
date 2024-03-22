import { useNavigate, useLocation, useParams } from 'react-router-dom'

// eslint-disable-next-line react/display-name
const withRouter = (WrappedComponent) => (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  return (
    <WrappedComponent
      {...props}
      navigate={navigate}
      location={location}
      params={params}
    />
  )
}

export default withRouter

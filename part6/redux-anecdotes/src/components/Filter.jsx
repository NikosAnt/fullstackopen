import { useSelector, useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const filter = useSelector((state) => state.filter)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    dispatch(setFilter(e.target.value))
  }

  const style = {
    marginBottom: 10,
  }

  return (
    <div style={style}>
      filter <input type="text" value={filter} onChange={handleChange} />
    </div>
  )
}

export default Filter

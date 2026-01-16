import PropTypes from 'prop-types'

const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </div>
  )
}

Person.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string
    }).isRequired,
    phone: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Person

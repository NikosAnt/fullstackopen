const Header = ({ course }) => {
  return (
    <>
      <h1>{course}</h1>
    </>
  )
}

const Part = ({ part, exercises }) => {
  return (
    <>
      <p>
        {part} {exercises}
      </p>
    </>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      ))}
    </>
  )
}

const Total = ({ parts }) => {
  return (
    <>
      {
        <p>
          <b>
            total of {parts.reduce((acc, part) => acc + part.exercises, 0)}{' '}
            exercises
          </b>
        </p>
      }
    </>
  )
}

const Course = ({ list }) => {
  return (
    <>
      {list.map(({ name, parts }) => (
        <div key={name}>
          <Header course={name} />
          <Content parts={parts} />
          <Total parts={parts} />
        </div>
      ))}
    </>
  )
}

export default Course

interface CoursePartBase {
  name: string
  exerciseCount: number
}

interface CoursePartDescription extends CoursePartBase {
  description: string
}

interface CoursePartBasic extends CoursePartDescription {
  kind: 'basic'
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number
  kind: 'group'
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string
  kind: 'background'
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: Array<string>
  kind: 'special'
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial

interface HeaderProps {
  courseName: string
}

interface PartProps {
  part: CoursePart
}

interface ContentProps {
  courseParts: CoursePart[]
}

interface TotalProps {
  total: number
}

const Header = (props: HeaderProps) => <h1>{props.courseName}</h1>

const Part = ({ part }: PartProps) => {
  const details: React.ReactNode[] = []

  switch (part.kind) {
    case 'basic':
      if ('description' in part)
        details.push(
          <div key="desc">
            <i>{part.description}</i>
          </div>
        )
    // fallthrough
    case 'group':
      if ('groupProjectCount' in part)
        details.push(
          <div key="group">project exercises {part.groupProjectCount}</div>
        )
    // fallthrough
    case 'background':
      if ('backgroundMaterial' in part)
        details.push(<div key="bg">submit to {part.backgroundMaterial}</div>)
    // fallthrough
    case 'special':
      if ('requirements' in part)
        details.push(
          <div key="req">required skills: {part.requirements.join(', ')}</div>
        )
    // fallthrough
    default:
      break
  }

  return (
    <div>
      <b>
        {part.name} {part.exerciseCount}
      </b>
      {details}
      <br />
    </div>
  )
}

const Content = (props: ContentProps) => (
  <div>
    {props.courseParts.map(part => (
      <Part key={part.name} part={part} />
    ))}
  </div>
)

const Total = (props: TotalProps) => (
  <div>Number of exercises {props.total}</div>
)

const App = () => {
  const courseName = 'Half Stack application development'

  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part',
      kind: 'basic',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: 'group',
    },
    {
      name: 'Basics of type Narrowing',
      exerciseCount: 7,
      description: 'How to go from unknown to string',
      kind: 'basic',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      backgroundMaterial:
        'https://type-level-typescript.com/template-literal-types',
      kind: 'background',
    },
    {
      name: 'TypeScript in frontend',
      exerciseCount: 10,
      description: 'a hard part',
      kind: 'basic',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      kind: 'special',
    },
  ]

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  )

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total total={totalExercises} />
    </div>
  )
}

export default App

import type { JSX } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import WorkIcon from '@mui/icons-material/Work'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import FavoriteIcon from '@mui/icons-material/Favorite'

import { type Entry, HealthCheckRating } from '../types'
import { getDiagnoses } from '../services/diagnoses'

export const EntryPage = ({ entry }: { entry: Entry }): JSX.Element => {
  const typeIcon = (() => {
    switch (entry.type) {
      case 'Hospital':
        return <LocalHospitalIcon color="error" fontSize="small" />
      case 'OccupationalHealthcare':
        return <WorkIcon color="primary" fontSize="small" />
      case 'HealthCheck':
        return <MedicalServicesIcon color="success" fontSize="small" />
      default:
        return null
    }
  })()

  const healthCheckIcon = (() => {
    if (entry.type !== 'HealthCheck') return null
    switch (entry.healthCheckRating) {
      case HealthCheckRating.Healthy:
        return <FavoriteIcon style={{ color: 'green' }} fontSize="small" />
      case HealthCheckRating.LowRisk:
        return <FavoriteIcon style={{ color: 'yellow' }} fontSize="small" />
      case HealthCheckRating.HighRisk:
        return <FavoriteIcon style={{ color: 'orange' }} fontSize="small" />
      case HealthCheckRating.CriticalRisk:
        return <FavoriteIcon style={{ color: 'red' }} fontSize="small" />
      default:
        return null
    }
  })()

  const { data: diagnoses } = useSuspenseQuery({
    queryKey: ['diagnoses'],
    queryFn: getDiagnoses
  })

  const getDiagnosesName = (code: string) =>
    diagnoses.find((d: { code: string; name: string }) => d.code === code)?.name ?? ''

  return (
    <article
      style={{
        border: '1px solid black',
        marginBottom: '1em',
        padding: '0 0.2em',
        borderRadius: '6px'
      }}
    >
      <p>
        {entry.date} {typeIcon}{' '}
        {'employerName' in entry && <i>{entry.employerName}</i>}
      </p>
      <p>
        <i>{entry.description}</i>
      </p>
      <ul>
        {entry.diagnosisCodes?.map(code => (
          <li key={code}>
            {code} {getDiagnosesName(code)}
          </li>
        ))}
      </ul>
      <p> {healthCheckIcon}</p>
      <p>diagnose by {entry.specialist}</p>
    </article>
  )
}

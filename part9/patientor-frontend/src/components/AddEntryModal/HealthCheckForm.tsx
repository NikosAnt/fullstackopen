import { type JSX, type FormEvent, useState } from 'react'
import {
  TextField,
  Button,
  type SelectChangeEvent,
  Select,
  MenuItem
} from '@mui/material'

import { HealthCheckRating, type NewHealthCheckEntry } from '../../types'

import { EntryForm } from './EntryForm'

interface Props {
  onCancel: () => void
  onSubmit: (entry: NewHealthCheckEntry) => void | Promise<void>
}

interface RatingOption {
  value: HealthCheckRating
  label: string
}

const ratingLabels: Record<HealthCheckRating, string> = {
  [HealthCheckRating.Healthy]: 'Healthy',
  [HealthCheckRating.LowRisk]: 'Low Risk',
  [HealthCheckRating.HighRisk]: 'High Risk',
  [HealthCheckRating.CriticalRisk]: 'Critical Risk'
}

const ratingOptions: RatingOption[] = Object.values(HealthCheckRating)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value,
    label: ratingLabels[value as HealthCheckRating]
  }))

export const HealthCheckForm = ({ onCancel, onSubmit }: Props): JSX.Element => {
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [specialist, setSpecialist] = useState('')
  const [healthCheckRating, setHealthCheckRating] = useState('')
  const [diagnosisCodes, setDiagnosisCodes] = useState('')

  const onRatingChange = (event: SelectChangeEvent) => {
    setHealthCheckRating(event.target.value)
  }

  const addEntry = (event: FormEvent) => {
    event.preventDefault()
    void onSubmit({
      type: 'HealthCheck',
      description,
      date,
      specialist,
      healthCheckRating: Number(healthCheckRating),
      diagnosisCodes: diagnosisCodes.split(',').map(code => code.trim())
    })

    setDescription('')
    setDate('')
    setSpecialist('')
    setHealthCheckRating(HealthCheckRating.Healthy.toString())
    setDiagnosisCodes('')
  }

  return (
    <form onSubmit={addEntry}>
      <EntryForm
        description={description}
        setDescription={setDescription}
        date={date}
        setDate={setDate}
        specialist={specialist}
        setSpecialist={setSpecialist}
      />
      <TextField
        placeholder="Diagnosis Code (comma separated)"
        value={diagnosisCodes}
        onChange={event => setDiagnosisCodes(event.target.value)}
        fullWidth
        required
      />
      <Select
        value={healthCheckRating}
        onChange={onRatingChange}
        fullWidth
        required
        displayEmpty
      >
        <MenuItem value="">Select health check rating...</MenuItem>
        {ratingOptions.map(rating => (
          <MenuItem key={rating.label} value={rating.value.toString()}>
            {rating.label}
          </MenuItem>
        ))}
      </Select>
      <Button
        color="secondary"
        variant="contained"
        type="button"
        onClick={onCancel}
      >
        CANCEL
      </Button>
      <Button style={{ float: 'right' }} variant="contained" type="submit">
        ADD
      </Button>
    </form>
  )
}

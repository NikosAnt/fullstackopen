import { type JSX, type FormEvent, useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

import { type NewHospitalEntry } from '../../types'

import { EntryForm } from './EntryForm'

interface Props {
  onCancel: () => void
  onSubmit: (entry: NewHospitalEntry) => void | Promise<void>
}

export const HospitalForm = ({ onCancel, onSubmit }: Props): JSX.Element => {
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [specialist, setSpecialist] = useState('')
  const [diagnosisCodes, setDiagnosisCodes] = useState('')
  const [dischargeDate, setDischargeDate] = useState('')
  const [dischargeCriteria, setDischargeCriteria] = useState('')

  const addEntry = (event: FormEvent) => {
    event.preventDefault()
    void onSubmit({
      type: 'Hospital',
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.split(',').map(code => code.trim()),
      discharge: {
        date: dischargeDate,
        criteria: dischargeCriteria
      }
    })

    setDescription('')
    setDate('')
    setSpecialist('')
    setDiagnosisCodes('')
    setDischargeDate('')
    setDischargeCriteria('')
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
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Discharge Information
        </Typography>
        <TextField
          type="date"
          value={dischargeDate}
          onChange={event => setDischargeDate(event.target.value)}
          fullWidth
          required
        />
        <TextField
          placeholder="Criteria"
          value={dischargeCriteria}
          onChange={event => setDischargeCriteria(event.target.value)}
          fullWidth
          required
        />
      </Box>
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

import { type JSX, type FormEvent, useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

import type { NewOccupationalHealthcareEntry } from '../../types'

import { EntryForm } from './EntryForm'

interface Props {
  onCancel: () => void
  onSubmit: (entry: NewOccupationalHealthcareEntry) => void | Promise<void>
}

export const OccupationalHealthcareForm = ({
  onCancel,
  onSubmit
}: Props): JSX.Element => {
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [specialist, setSpecialist] = useState('')
  const [diagnosisCodes, setDiagnosisCodes] = useState('')
  const [employerName, setEmployerName] = useState('')
  const [sickLeaveStart, setSickLeaveStart] = useState('')
  const [sickLeaveEnd, setSickLeaveEnd] = useState('')

  const addEntry = (event: FormEvent) => {
    event.preventDefault()
    void onSubmit({
      type: 'OccupationalHealthcare',
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes
        ? diagnosisCodes.split(',').map(code => code.trim())
        : [],
      employerName
    })
    setDescription('')
    setDate('')
    setSpecialist('')
    setDiagnosisCodes('')
    setEmployerName('')
    setSickLeaveStart('')
    setSickLeaveEnd('')
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
      <TextField
        placeholder="Employer Name"
        value={employerName}
        onChange={event => setEmployerName(event.target.value)}
        fullWidth
        required
      />
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Sick Leave (from... to) (optional)
        </Typography>
        <TextField
          type="date"
          value={sickLeaveStart}
          onChange={event => setSickLeaveStart(event.target.value)}
          fullWidth
        />
        <TextField
          type="date"
          value={sickLeaveEnd}
          onChange={event => setSickLeaveEnd(event.target.value)}
          fullWidth
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

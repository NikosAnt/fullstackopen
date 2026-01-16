import { useState, type SyntheticEvent, type JSX } from 'react'
import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  type SelectChangeEvent
} from '@mui/material'

import { type PatientFormValues, Gender } from '../../types'

interface Props {
  onCancel: () => void
  onSubmit: (values: PatientFormValues) => void
}

interface GenderOption {
  value: Gender
  label: string
}

const genderOptions: GenderOption[] = Object.values(Gender).map(v => ({
  value: v,
  label: v
}))

export const AddPatientForm = ({ onCancel, onSubmit }: Props): JSX.Element => {
  const [name, setName] = useState('')
  const [occupation, setOccupation] = useState('')
  const [ssn, setSsn] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState(Gender.Other)

  const onGenderChange = (event: SelectChangeEvent) => {
    event.preventDefault()
    const value = event.target.value as Gender
    setGender(value)
  }

  const addPatient = (event: SyntheticEvent) => {
    event.preventDefault()
    onSubmit({
      name,
      occupation,
      ssn,
      dateOfBirth,
      gender
    })
  }

  return (
    <div>
      <form onSubmit={addPatient}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
        <TextField
          label="Social security number"
          fullWidth
          value={ssn}
          onChange={({ target }) => setSsn(target.value)}
        />
        <TextField
          label="Date of birth"
          placeholder="YYYY-MM-DD"
          fullWidth
          value={dateOfBirth}
          onChange={({ target }) => setDateOfBirth(target.value)}
        />
        <TextField
          label="Occupation"
          fullWidth
          value={occupation}
          onChange={({ target }) => setOccupation(target.value)}
        />

        <InputLabel style={{ marginTop: 20 }}>Gender</InputLabel>
        <Select
          label="Gender"
          fullWidth
          value={gender}
          onChange={onGenderChange}
        >
          {genderOptions.map(option => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left' }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid>
            <Button
              style={{
                float: 'right'
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

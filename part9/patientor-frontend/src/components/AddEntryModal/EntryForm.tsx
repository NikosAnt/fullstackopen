import type { JSX } from 'react'
import { TextField } from '@mui/material'

interface CommonFieldsProps {
  description: string
  setDescription: (value: string) => void
  date: string
  setDate: (value: string) => void
  specialist: string
  setSpecialist: (value: string) => void
}

export const EntryForm = ({
  description,
  setDescription,
  date,
  setDate,
  specialist,
  setSpecialist
}: CommonFieldsProps): JSX.Element => (
  <>
    <TextField
      placeholder="Description"
      value={description}
      onChange={e => setDescription(e.target.value)}
      fullWidth
      required
    />
    <TextField
      type="date"
      value={date}
      onChange={e => setDate(e.target.value)}
      fullWidth
      required
    />
    <TextField
      placeholder="Specialist"
      value={specialist}
      onChange={e => setSpecialist(e.target.value)}
      fullWidth
      required
    />
  </>
)

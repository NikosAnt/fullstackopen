import { type JSX, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'

import type { NewEntry } from '../../types'

import { HealthCheckForm } from './HealthCheckForm'
import { OccupationalHealthcareForm } from './OccupationalHealthcareForm'
import { HospitalForm } from './HospitalForm'

type EntryType = 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital'

interface Props {
  modalOpen: boolean
  onSubmit: (entry: NewEntry) => void | Promise<void>
  onClose: () => void
  error?: string
}

export const AddEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error
}: Props): JSX.Element => {
  const [entryType, setEntryType] = useState<EntryType>('HealthCheck')

  const entryForm = (() => {
    switch (entryType) {
      case 'HealthCheck':
        return <HealthCheckForm onSubmit={onSubmit} onCancel={onClose} />
      case 'OccupationalHealthcare':
        return (
          <OccupationalHealthcareForm onSubmit={onSubmit} onCancel={onClose} />
        )
      case 'Hospital':
        return <HospitalForm onSubmit={onSubmit} onCancel={onClose} />
      default: {
        const exhaustiveCheck: never = entryType
        return exhaustiveCheck
      }
    }
  })()

  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>Add a new Entry</DialogTitle>
      <Divider />
      <DialogContent>
        {typeof error === 'string' && error.trim() !== '' && (
          <Alert severity="error">{error}</Alert>
        )}
        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel id="entry-type-label">Entry Type</InputLabel>
          <Select
            labelId="entry-type-label"
            value={entryType}
            label="Entry Type"
            onChange={e => setEntryType(e.target.value as EntryType)}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              Occupational Healthcare
            </MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
          </Select>
        </FormControl>
        {entryForm}
      </DialogContent>
    </Dialog>
  )
}

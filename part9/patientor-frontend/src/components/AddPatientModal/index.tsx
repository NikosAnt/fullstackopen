import type { JSX } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Alert
} from '@mui/material'

import { type PatientFormValues } from '../../types'

import { AddPatientForm } from './AddPatientForm'

interface Props {
  modalOpen: boolean
  onClose: () => void
  onSubmit: (values: PatientFormValues) => void
  error?: string
}

export const AddPatientModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error
}: Props): JSX.Element => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      {typeof error === 'string' && error.trim() !== '' && (
        <Alert severity="error">{error}</Alert>
      )}
      <AddPatientForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
)

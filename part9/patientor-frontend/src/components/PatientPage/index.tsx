import { useParams } from '@tanstack/react-router'
import { useState, type JSX } from 'react'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import TransgenderIcon from '@mui/icons-material/Transgender'
import { Button } from '@mui/material'

import { type Entry, type NewEntry, Gender } from '../../types'
import { getPatientById, createEntry } from '../../services/patients'
import { EntryPage } from '../EntryPage'
import { AddEntryModal } from '../AddEntryModal'
import { Notification } from '../Notification'

export const PatientPage = (): JSX.Element => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })

  const handleSuccess = () =>
    setNotification({
      open: true,
      message: 'New Entry added!',
      severity: 'success'
    })

  const handleError = (message: string) =>
    setNotification({
      open: true,
      message,
      severity: 'error'
    })

  const { id } = useParams({ from: '/patients/$id' })
  const queryClient = useQueryClient()

  const { data: patient } = useSuspenseQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(id)
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState<string>()

  const openModal = () => setModalOpen(true)
  const closeModal = () => {
    setModalOpen(false)
    setError(undefined)
  }

  const submitNewEntry = async (entry: NewEntry) => {
    try {
      await createEntry(patient.id, entry)
      closeModal()
      await queryClient.invalidateQueries({ queryKey: ['patient', id] })
      handleSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setError(message)
      handleError(message)
      console.error(message)
    }
  }

  const genderIcon =
    patient.gender === Gender.Male ? (
      <MaleIcon color="primary" fontSize="inherit" />
    ) : patient.gender === Gender.Female ? (
      <FemaleIcon color="secondary" fontSize="inherit" />
    ) : (
      <TransgenderIcon color="action" fontSize="inherit" />
    )

  return (
    <section>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() =>
          setNotification({
            ...notification,
            open: false
          })
        }
      />
      <h2>
        {patient.name} {genderIcon}
      </h2>
      <p>ssn: {patient.ssn ?? '-'}</p>
      <p>occupation: {patient.occupation}</p>
      <br />
      <h3>Entries</h3>
      {patient.entries.map((entry: Entry) => (
        <EntryPage key={entry.id} entry={entry} />
      ))}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        onClose={closeModal}
        {...(error !== undefined ? { error } : {})}
      />
      <Button variant="contained" onClick={openModal}>
        Add New Entry
      </Button>
    </section>
  )
}

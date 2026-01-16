import { useState, type JSX } from 'react'
import {
  Box,
  Table,
  Button,
  TableHead,
  Typography,
  TableCell,
  TableRow,
  TableBody
} from '@mui/material'
import axios from 'axios'
import { Link } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { type PatientFormValues, type Patient } from '../../types'
import { AddPatientModal } from '../AddPatientModal'
import { HealthRatingBar } from '../HealthRatingBar'
import { Notification } from '../Notification'
import { createPatient, getPatients } from '../../services/patients'

export const PatientListPage = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [notificationSeverity, setNotificationSeverity] = useState<
    'success' | 'error'
  >('success')
  const queryClient = useQueryClient()

  const { data: patients } = useSuspenseQuery({
    queryKey: ['patients'],
    queryFn: getPatients
  })

  const openModal = (): void => setModalOpen(true)

  const closeModal = (): void => {
    setModalOpen(false)
    setError(undefined)
  }

  const closeNotification = (): void => {
    setNotificationOpen(false)
  }

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      await createPatient(values)
      setModalOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['patients'] })

      setNotificationSeverity('success')
      setNotificationMessage(`Added patient: ${values.name}`)
      setNotificationOpen(true)
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response && typeof e.response.data === 'string') {
          const message = e.response.data.replace(
            'Something went wrong. Error: ',
            ''
          )
          console.error(message)
          setError(message)

          setNotificationSeverity('error')
          setNotificationMessage(message)
          setNotificationOpen(true)
        } else {
          setError('Unrecognized axios error')

          setNotificationSeverity('error')
          setNotificationMessage('Unrecognized axios error')
          setNotificationOpen(true)
        }
      } else {
        console.error('Unknown error', e)
        setError('Unknown error')

        setNotificationSeverity('error')
        setNotificationMessage('Unknown error')
        setNotificationOpen(true)
      }
    }
  }

  return (
    <div className="App">
      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        onClose={closeNotification}
      />
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: '1em' }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(patients).map((patient: Patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <Link to="/patients/$id" params={{ id: patient.id }}>
                  {patient.name}
                </Link>
              </TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        onClose={closeModal}
        {...(error !== undefined ? { error } : {})}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  )
}

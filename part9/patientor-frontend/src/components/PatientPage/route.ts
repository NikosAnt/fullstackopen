import { createRoute } from '@tanstack/react-router'

import { rootRoute } from '../../rootRoute'

import { PatientPage } from './index'

export const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients/$id',
  component: PatientPage
})

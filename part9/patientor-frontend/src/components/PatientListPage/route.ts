import { createRoute } from '@tanstack/react-router'

import { rootRoute } from '../../rootRoute'

import { PatientListPage } from './index'

export const patientListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PatientListPage
})

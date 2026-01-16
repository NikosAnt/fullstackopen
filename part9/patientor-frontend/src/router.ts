import { createRouter } from '@tanstack/react-router'

import { rootRoute } from './rootRoute'
import { patientListRoute } from './components/PatientListPage/route'
import { patientRoute } from './components/PatientPage/route'

const routeTree = rootRoute.addChildren([patientListRoute, patientRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

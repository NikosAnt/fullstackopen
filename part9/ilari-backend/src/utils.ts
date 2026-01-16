import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'

import { Visibility, Weather } from './types'

export const NewEntrySchema = z.object({
  weather: z.enum([
    Weather.Sunny,
    Weather.Rainy,
    Weather.Cloudy,
    Weather.Stormy,
    Weather.Windy
  ]),
  visibility: z.enum([
    Visibility.Great,
    Visibility.Good,
    Visibility.Ok,
    Visibility.Poor
  ]),
  date: z.coerce.date(),
  comment: z.string().optional()
})

export const newDiaryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    NewEntrySchema.parse(req.body)
    next()
  } catch (error: unknown) {
    next(error)
  }
}

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues })
  } else {
    next(error)
  }
}

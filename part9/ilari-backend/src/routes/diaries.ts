import { Router, type Request, type Response } from 'express'

import type {
  DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry
} from '../types'
import diaryService from '../services/diaryService'
import { newDiaryParser, errorMiddleware } from '../utils'

const router = Router()

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id))

  if (diary) {
    res.send(diary)
  } else {
    res.sendStatus(404)
  }
})

router.get('/', (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries())
})

router.post(
  '/',
  newDiaryParser,
  (
    req: Request<unknown, unknown, NewDiaryEntry>,
    res: Response<DiaryEntry>
  ) => {
    const addedEntry = diaryService.addDiary(req.body)
    res.json(addedEntry)
  }
)

router.use(errorMiddleware)

export default router

import type { JSX } from 'react'
import { Rating } from '@mui/material'
import { Favorite } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

type BarProps = {
  rating: number
  showText: boolean
}

const StyledRating = styled(Rating)({
  iconFilled: {
    color: '#ff6d75'
  },
  iconHover: {
    color: '#ff3d47'
  }
})

const HEALTHBAR_TEXTS = [
  'The patient is in great shape',
  'The patient has a low risk of getting sick',
  'The patient has a high risk of getting sick',
  'The patient has a diagnosed condition'
] as const

export const HealthRatingBar = ({
  rating,
  showText
}: BarProps): JSX.Element => {
  const isValidRating =
    Number.isInteger(rating) && rating >= 0 && rating < HEALTHBAR_TEXTS.length

  let healthText = 'Unknown health status'
  if (isValidRating) {
    switch (rating) {
      case 0:
        healthText = HEALTHBAR_TEXTS[0]
        break
      case 1:
        healthText = HEALTHBAR_TEXTS[1]
        break
      case 2:
        healthText = HEALTHBAR_TEXTS[2]
        break
      case 3:
        healthText = HEALTHBAR_TEXTS[3]
        break
      default:
        healthText = 'Unknown health status'
    }
  }

  return (
    <div className="health-bar">
      <StyledRating
        readOnly
        value={4 - (isValidRating ? rating : 0)}
        max={4}
        icon={<Favorite fontSize="inherit" />}
      />

      {showText ? <p>{healthText}</p> : null}
    </div>
  )
}

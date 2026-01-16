import { useState } from 'react'

export const useBlogForm = ({
  initial = { title: '', author: '', url: '' },
  onSubmit
}) => {
  const [values, setValues] = useState(initial)

  const handleChange = event => {
    const { name, value } = event.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit(values)
  }

  const reset = () => setValues(initial)

  return { values, handleChange, handleSubmit, reset }
}

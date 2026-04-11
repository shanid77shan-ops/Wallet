import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './BackButton.css'

export default function BackButton({ to }) {
  const navigate = useNavigate()

  function handleBack() {
    if (to) {
      navigate(to)
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <button className="back-btn" onClick={handleBack} aria-label="Go back">
      <ArrowLeft size={18} strokeWidth={2.5} />
    </button>
  )
}

import { useCallback } from "react"
import { useRouter } from "next/router"

const Logo = ({
  textSize,
  onClick
}) => {
  const router = useRouter()

  const navigate = useCallback(() => {
    router.push('/')
  }, [])

  return (
    <div className="relative inline-block">
        <h1 onClick={onClick || navigate} className={`font-sans relative ${textSize || 'text-6xl'} cursor-pointer font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text animate-text`}>HANDANA</h1>
    </div>
  )
}

export default Logo
const Logo = ({
  textSize
}) => {
  return (
    <div className="relative inline-block">
        <h1 className={`font-sans relative z-10 ${textSize || 'text-6xl'} font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text animate-text`}>HANDANA</h1>
    </div>
  )
}

export default Logo
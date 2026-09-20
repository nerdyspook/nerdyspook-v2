import { useState } from 'react'
import Image from 'next/image'

const ProfileImage = () => {
  const [useOriginal, setUseOriginal] = useState(false)

  return (
    <Image
      src="/images/susanto.jpg"
      alt="Susanto Mahato"
      width={100}
      height={100}
      loading="eager"
      fetchPriority="high"
      unoptimized={process.env.NODE_ENV === 'development' || useOriginal}
      onError={() => setUseOriginal(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}

export default ProfileImage

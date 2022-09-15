import React from 'react'
import { useRouter } from 'next/router'

const Page = () => {
  const router = useRouter()
  const contract = router.query.params ? router.query.params[0] : null
  const id = router.query.params ? router.query.params[1] : null

  return (
    <>
    {contract}
    <br />
    {id}
    </>
  )
}

export default Page

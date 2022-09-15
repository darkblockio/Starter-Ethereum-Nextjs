import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import styles from './styles/Home.module.css'

export default function Home() {
  const address = ''
  return (
    <>
      <Header address={address} />
      <div className={styles.container}>
        <h1 className="text-2xl">Gallery</h1>
      </div>
    </>
  )
}

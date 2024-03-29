import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className='flex'>
        <Sidebar/>
        <Center />
      </main>

      <div>
        {/* Player */}
      </div>
    </div>
  )
}

import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className=''>
        <Sidebar/>
        <Center />
      </main>

      <div>
        {/* Player */}
      </div>
    </div>
  )
}

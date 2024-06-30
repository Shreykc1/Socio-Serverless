import { Outlet } from 'react-router-dom'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Topbar from '@/components/shared/Topbar'
import Bottombar from '@/components/shared/Bottombar'


const RootLayout = () => {
  return (
    <div className='w-full m:flex'>
        <Topbar />
        <LeftSidebar />
        <section className='flex flex-1'>
            <Outlet/>
        </section>

        <Bottombar />
    </div>
  )
}

export default RootLayout
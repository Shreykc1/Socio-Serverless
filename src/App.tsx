import AuthLayout from './_auth/AuthLayout'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import RootLayout from './_root/RootLayout'
import { Home, RePost } from './_root/pages'

import './globals.css'
import { Route, Routes } from 'react-router-dom'


import { Toaster } from "@/components/ui/toaster"
import Explore from './_root/pages/Explore'
import Saved from './_root/pages/Saved'
import AllUsers from './_root/pages/AllUsers'
import CreatePosts from './_root/pages/CreatePosts'
import UpdatePosts from './_root/pages/UpdatePosts'
import Posts from './_root/pages/Posts'
import Profile from './_root/pages/Profile'
import UpdateProfile from './_root/pages/UpdateProfile'


const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>
          
                         {/* public routes  */}
          <Route element={<AuthLayout />}>
            <Route path='/sign-in' element={<SigninForm />}/>
            <Route path='/sign-up' element={<SignupForm />}/>
          </Route>

                        {/* private routes  */}
          <Route element={<RootLayout />}>
            <Route index element={<Home/>} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/saved' element={<Saved />} />
            <Route path='/all-users' element={<AllUsers />} />
            <Route path='/create-post' element={<CreatePosts />} />
            <Route path='/update-post/:id' element={<UpdatePosts />} />
            <Route path='/posts/:id' element={<Posts />} />
            <Route path='/repost/:id' element={<RePost />} />
            <Route path='/profile/:id/*' element={<Profile />} />
            <Route path='/update-profile/:id' element={<UpdateProfile />} />
          </Route>
        </Routes>


      <Toaster />
    </main>
  )
}

export default App
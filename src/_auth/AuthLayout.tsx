import { Outlet, Navigate } from 'react-router-dom'
import {  useEffect } from 'react'



const AuthLayout = () => {
  const isAuthenticated = false

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/"/> 
      ): (
        <>
          <section className='flex flex-1 justify-center items-center flex-col p-10'>
            <Outlet />
          </section>

          <img
          src='/assets/images/MainSignUp.png'
          alt='logo'
          className='hidden xl:block h-[115vh] w-1/2 object-cover bg-no-repeat relative bottom-14'
          />
        </>
        )
      }
    </>
  )
}

export default AuthLayout
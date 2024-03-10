import { NavLink } from 'react-router-dom'
import useUserStore from '../../stores/userStore'
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

import './header.css'

const cookies = new Cookies();

export default function Header() {
  const {user, logoutUser} = useUserStore()
  const navigate = useNavigate();

  function handleLogout(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()

    logoutUser();
    cookies.remove("TOKEN", { path: "/" });
    navigate("/login")
  }

  return (
    <header>
      <NavLink id="logo" to='/' title="R&M">R&M</NavLink>
      {user ? (
        <>
        <nav id="mainMenu" className='menu'>
          <NavLink to='/' className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to='/favorites' className={({isActive}) => isActive ? 'active' : ''}>Favorites</NavLink>
        </nav>
        <nav id="userMenu" className='menu'>
          <a href='/logout' onClick={handleLogout}>Logout</a>
        </nav>
        </>
      ): (
        <nav id="userMenu" className='menu'>
          <NavLink to='/register' className={({isActive}) => isActive ? 'active' : ''}>Register</NavLink>
          <NavLink to='/login' className={({isActive}) => isActive ? 'active' : ''}>Login</NavLink>
        </nav>
      )}
    </header>
  )
}
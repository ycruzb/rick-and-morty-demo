import { Outlet, Navigate } from "react-router-dom"
import Cookies from "universal-cookie";
import useUserStore from "../stores/userStore";
const cookies = new Cookies();

export default function PrivateRoute() {
  const { loggedInUser, logoutUser, user } = useUserStore();
  const token = cookies.get("TOKEN");
  if (token && !user) {
    loggedInUser(token)
  }
  if (!token && user) {
    logoutUser()
  }

  return (
    token ? <Outlet /> : <Navigate to="/login" />
  )
}
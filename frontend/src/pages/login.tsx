import PageLayout from "../layouts/page/page"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const loginUser = async (data: { email: string, password: string }) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const responseJson = await response.json()

  if (!response.ok) {
    throw new Error(responseJson.message)
  }

  return responseJson
}


export default function LoginPage() {
  const navigate = useNavigate();
  const {loggedInUser} = useUserStore()

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const token = data.token
      cookies.set("TOKEN", token, {
        path: "/",
      });
      loggedInUser(token)
      toast.dismiss()
      navigate("/")
    },
    onError: (error) => {
      console.error(error)
      toast.error(error.message)
    }
  })

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      email: { value: string },
      password: { value: string },
    }
    const email = target.email.value
    const password = target.password.value

    mutation.mutate({ email, password })
  }

  return <PageLayout>
    <div className="authWrapper">
      <h1>Login</h1>
      <p className="gray">Enter your credentials and start having fun!</p>
      <div className="card">
        <form onSubmit={handleOnSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
      <p className="center">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
    <Toaster />
  </PageLayout>
}
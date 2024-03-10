import PageLayout from "../layouts/page/page"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const registerUser = async (data: { email: string, password: string }) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/register`, {
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

export default function RegisterPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created successfully. Please, log in!");
      setTimeout(() => {
        toast.dismiss();
        navigate("/login")
      }, 2000)
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
      passwordConfirmed: { value: string },
    }
    const email = target.email.value
    const password = target.password.value
    const passwordConfirmed = target.passwordConfirmed.value

    if (password !== passwordConfirmed) {
      toast.error("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.")
      return
    }

    mutation.mutate({ email, password })
  }

  return <PageLayout>
    <div className="authWrapper">
      <h1>Register</h1>
      <p className="gray">Be part of this amazing world!</p>
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
          <div>
            <label htmlFor="passwordConfirmed">Repeat password</label>
            <input type="password" name="passwordConfirmed" id="passwordConfirmed" required />
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
      <p className="center">Already have an account? <Link to="/login">Login</Link></p>
    </div>
    <Toaster />
  </PageLayout>
}
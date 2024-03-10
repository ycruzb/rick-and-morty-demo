import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import PrivateRoute from "./components/privateRoute"
import HomePage from "./pages/home"
import ErrorPage from "./pages/error"
import CharacterPage from "./pages/character"
import FavoritesPage from "./pages/favorites"
import Header from "./components/header/header"
import AuthRoute from "./components/authRoute"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function App() {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/character/:characterId" element={<CharacterPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
            <Route element={<AuthRoute />}>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  )
}
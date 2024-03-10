import PageLayout from "../layouts/page/page"
import { useQuery } from "@tanstack/react-query"
import useUserStore from "../stores/userStore"
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import CharactersList from "../components/charactersList/charactersList";
import { Character } from "../types/character";

const cookies = new Cookies();

export default function FavoritesPage() {
  const { user, logoutUser } = useUserStore()
  const navigate = useNavigate();

  const { isPending, error, data } = useQuery({
    queryKey: [`favorites`],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/favorites`, {
        headers: {Authorization: `Bearer ${user?.token || ''}`}
      });
      if (response.ok) {
        const responseData =  await response.json()
        return (responseData as Character[]);
      }
      if (response.status === 401) {
        logoutUser();
        cookies.remove("TOKEN", { path: "/" });
        navigate("/login");
      }
    }
  })

  if (isPending) return <p className="center">Loading...</p>

  if (error) return <>
    <p className="center">Hey, an error has occurred.</p>
    <p className="center"><Link to="/">&larr; Go to the list again!</Link></p>
  </>

  if (!data) return <p className="center">It's weird, something went wrong, redirecting....</p>

  return <PageLayout>
    <h2 className="center">Favorites</h2>
    <CharactersList characters={data} />
  </PageLayout>
}
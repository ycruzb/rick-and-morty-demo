import PageLayout from "../layouts/page/page"
import { useQuery } from "@tanstack/react-query"
import useUserStore from "../stores/userStore"
import Cookies from "universal-cookie";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Character } from "../types/character";
import CharacterDetails from "../components/characterDetails/characterDetails";

const cookies = new Cookies();

export default function CharacterPage() {
  const { user, logoutUser } = useUserStore()
  const navigate = useNavigate();
  const {characterId} = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: [`character${characterId}`],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/characters/${characterId}`, {
        headers: {Authorization: `Bearer ${user?.token || ''}`}
      });
      if (response.ok) {
        const responseData =  await response.json()
        return (responseData as Character);
      }
      if (response.status === 401) {
        logoutUser();
        cookies.remove("TOKEN", { path: "/" });
        navigate("/login");
      }
    }
  })

  function goBack() {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  }

  if (isPending) return <p className="center">Loading...</p>

  if (error) return <>
    <p className="center">Hey, an error has occurred.</p>
    <p className="center"><Link to="/">&larr; Go to the list again!</Link></p>
  </>

  if (!data) return <p className="center">It's weird, something went wrong, redirecting....</p>

  return <PageLayout>
    <p className="center"><span onClick={goBack} style={{cursor: 'pointer'}}>&larr; Back</span></p>
    <CharacterDetails character={data} />
  </PageLayout>
}
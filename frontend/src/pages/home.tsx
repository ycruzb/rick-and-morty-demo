import PageLayout from "../layouts/page/page"
import { useQuery } from "@tanstack/react-query"
import useUserStore from "../stores/userStore"
import Cookies from "universal-cookie";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/pagination/pagination";
import { dataApiCharactersListResponse } from "../types/dataApiResponse";
import CharactersList from "../components/charactersList/charactersList";
import Filter from "../components/filter/filter";
import FilterList from "../components/filterList/filterList";
import { useEffect } from "react";

const cookies = new Cookies();

const availableFilterFields = [
  {
    field: 'status',
    label: 'Status',
    values: ['all', 'alive', 'dead', 'unknown']
  },
  {
    field: 'gender',
    label: 'Gender',
    values: ['all', 'female', 'male', 'genderless', 'unknown']
  }
]

export default function HomePage() {
  const { user, logoutUser } = useUserStore()
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ? searchParams.get('page') : '1';
  const status = searchParams.get('status') ? searchParams.get('status') : '';
  const gender = searchParams.get('gender') ? searchParams.get('gender') : '';

  const { isPending, error, data } = useQuery({
    queryKey: [`charactersList${page}${status}${gender}`],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/characters/?page=${page}${status === 'all' ? '' : `&status=${status}`}${gender === 'all' ? '' : `&gender=${gender}`}`, {
        headers: { Authorization: `Bearer ${user?.token || ''}` }
      });
      if (response.ok) {
        const responseData = await response.json()
        return (responseData as dataApiCharactersListResponse);
      }
      if (response.status === 401) {
        logoutUser();
        cookies.remove("TOKEN", { path: "/" });
        navigate("/login");
      }
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (isPending) return <p className="center">Loading...</p>

  if (error) return <>
    <p className="center">Hey, an error has occurred.</p>
    <p className="center"><Link to="/">&larr; Go to the list again!</Link></p>
  </>

  if (!data) return <p className="center">It's weird, something went wrong, redirecting....</p>

  let prevLink: string | null = null;
  if (data.info.prev) {
    prevLink = data.info.prev.replace(import.meta.env.VITE_DATA_API_URL, '');
  }

  let nextLink: string | null = null;
  if (data.info.next) {
    nextLink = data.info.next.replace(import.meta.env.VITE_DATA_API_URL, '');
  }

  let firstLink: string | null = null;
  if (data.info.pages > 0 && Number(page) > 1) {
    firstLink = `/?page=1${status ? `&status=${status}` : ''}${gender ? `&gender=${gender}` : ''}`;
  }

  let lastLink: string | null = null;
  if (data.info.pages > 1 && Number(page) < data.info.pages) {
    lastLink = `/?page=${data.info.pages}${status ? `&status=${status}` : ''}${gender ? `&gender=${gender}` : ''}`;
  }

  return <PageLayout>
    <h2 className="center">Meet the crew</h2>
    <FilterList>
      {availableFilterFields.map(filter => (
        <Filter key={filter.field} field={filter.field} label={filter.label} values={filter.values} availableFilterFields={availableFilterFields.map(f => f.field)} />
      ))}
      {((status && status !== 'all') || (gender && gender !== 'all')) && (
        <Link to="/">Clear</Link>
      )}
    </FilterList>
    <CharactersList characters={data.results} />
    <Pagination prev={prevLink} next={nextLink} first={firstLink} last={lastLink} />
  </PageLayout>
}
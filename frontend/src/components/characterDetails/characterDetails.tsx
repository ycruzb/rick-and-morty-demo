import { Character } from "../../types/character";
import './characterDetails.css'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import Cookies from "universal-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

const cookies = new Cookies();

const addFavorite = async (data: { token: string, characterId: number }) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${data.token}`
    },
    body: JSON.stringify(data),
  })

  const responseJson = await response.json()

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized")
    }
    throw new Error(responseJson.message)
  }

  return responseJson
}

const removeFavorite = async (data: { token: string, characterId: number }) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/favorites`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${data.token}`
    },
    body: JSON.stringify(data),
  })

  const responseJson = await response.json()

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized")
    }
    throw new Error(responseJson.message)
  }

  return responseJson
}


interface CharacterDetailsProps {
  character: Character
}
export default function CharacterDetails({character}: CharacterDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(character.isFavorite);
  const navigate = useNavigate();
  const {logoutUser} = useUserStore();
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient()

  useEffect(() => {
    setIsFavorite(character.isFavorite)
  }, [character.isFavorite])

  const mutationAddFavorite = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      setIsFavorite(true)
      setIsSending(false);
    },
    onError: (error) => {
      setIsSending(false);
      if (error.message === "Unauthorized") {
        logoutUser();
        cookies.remove("TOKEN", { path: "/" });
        navigate("/login");
      } else {
        toast.error(error.message)
      }
    }
  })

  const mutationRemoveFavorite = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries()
      setIsFavorite(false)
      setIsSending(false);
    },
    onError: (error) => {
      setIsSending(false);
      if (error.message === "Unauthorized") {
        logoutUser();
        cookies.remove("TOKEN", { path: "/" });
        navigate("/login");
      } else {
        toast.error(error.message)
      }
    }
  })

  const handleAddFavorite = () => {
    setIsSending(true);
    mutationAddFavorite.mutate({ token: cookies.get("TOKEN"), characterId: character.id })
  }

  const handleRemoveFavorite = () => {
    setIsSending(true);
    mutationRemoveFavorite.mutate({ token: cookies.get("TOKEN"), characterId: character.id })
  }

  return (
    <div id="characterDetails">
      <div className="details">
        <img src={character.image} alt={character.name} />
        <div className="data">
          <h1>{character.name}</h1>
          <div className="row">
            <div className="flex">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
              </svg>
              <p>{character.status === 'Alive' ? `I'm a` : `I was a`} <strong>{character.species}</strong> and <strong>{character.gender}</strong>{character.type ? <> but also a <strong>{`${character.type}`}</strong></> : null}</p>
            </div>
            <div className="flex">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <p>{character.location.name}</p>
            </div>
            <div className="flex">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <p>{character.origin.name}</p>
            </div>
          </div>
          <div className="flex">
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <div className="episodesList">
              {character.episode.length > 0 ? character.episode.map((episodeLink) => {
                const episodeNumber = episodeLink.split('/episode/')[1];
                return <div className="episode">{episodeNumber}</div>
              }) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="content-favorite">
        {isFavorite && !isSending && (
          <svg onClick={handleRemoveFavorite} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#b91c1c" className="w-6 h-6">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        )}
        {isFavorite && isSending && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6b7280" className="w-6 h-6">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        )}
        {!isFavorite && !isSending && (
          <svg onClick={handleAddFavorite} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#b91c1c" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        )}
        {!isFavorite && isSending && (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6b7280" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        )}
      </div>
      <Toaster />
    </div>
  )
}
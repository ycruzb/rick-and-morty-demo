import { useEffect, useState } from "react"
import { Character } from "../../types/character"
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import Cookies from "universal-cookie";

const cookies = new Cookies();

import './characterItem.css'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

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

interface CharacterItemProps {
  character: Character
}

export default function CharacterItem({ character }: CharacterItemProps) {
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
      queryClient.invalidateQueries()
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
    <>
      <div className="characterItem">
        <Link to={`/character/${character.id}`}>
          <img src={character.image} alt={character.name} />
        </Link>
        <div className={`badge ${character.status}`}>{character.status}</div>
        <div className="content">
          <div className="content-info">
            <Link to={`/character/${character.id}`}>
              <h3>{character.name}</h3>
              <p className="gray">{character.species}</p>
            </Link>
          </div>
          <div className="content-favorite">
            {isFavorite && !isSending && (
              <svg className="isFavoriteIcon" onClick={handleRemoveFavorite} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#b91c1c">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            )}
            {isFavorite && isSending && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6b7280" >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            )}
            {!isFavorite && !isSending && (
              <svg className="isNotFavoriteIcon" onClick={handleAddFavorite} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#b91c1c" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            )}
            {!isFavorite && isSending && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6b7280" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
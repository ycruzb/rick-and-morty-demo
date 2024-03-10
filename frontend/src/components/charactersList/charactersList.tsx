import { Character } from "../../types/character";
import CharacterItem from "../characterItem/characterItem";
import "./charactersList.css";

interface CharactersListProps {
  characters: Character[]
}
export default function CharactersList({ characters }: CharactersListProps) {
  if (characters.length === 0) {
    return <p className="center">No characters found</p>
  }

  return (
    <div className="charactersList">
      {characters.map((character: Character) => <CharacterItem key={character.id} character={character} />)}
    </div>
  )
}
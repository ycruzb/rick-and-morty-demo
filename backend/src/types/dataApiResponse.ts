import { Character } from './character';

export type dataApiCharactersListResponse = {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string;
  };
  results: Character[];
};

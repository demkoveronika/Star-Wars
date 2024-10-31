const BASE_URL = 'https://sw-api.starnavi.io/';

export const fetchHeroes = async (page = 1, limit = 9) => {
  const response = await fetch(`${BASE_URL}people/?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error ('Failed to fetch heroes');
  }

  return await response.json();
}

export const fetchHeroById = async (heroId: number) => {
  const response = await fetch(`${BASE_URL}people/${heroId}/`)

  if (!response.ok) {
    throw new Error ('Failed to fetch heroes by id')
  }

  return await response.json();
}

export const fetchFilmsForHeroes = async () => {
  const response = await fetch(`${BASE_URL}films/`)

  if (!response.ok) {
    throw new Error ('Failer to fetch movies')
  }

  return await response.json();
}

export const fetchShipsForHeroes = async () => {
  const pageCount = 4;
  const shipData = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    try {
      const response = await fetch(`${BASE_URL}starships/?page=${pageNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch starships');
      }

      const data = await response.json();
      shipData.push(...data.results);
    } catch (error) {
      console.error(`Error fetching starships on page ${pageNumber}:`, error);
      throw error;
    }
  }

  return shipData;
};
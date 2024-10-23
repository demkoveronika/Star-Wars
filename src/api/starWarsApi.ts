const BASE_URL = 'https://sw-api.starnavi.io/';

export const fetchHeroes = async (page = 1, limit = 9) => {
  const responce = await fetch(`${BASE_URL}people/?page=${page}&limit=${limit}`);

  if (!responce.ok) {
    throw new Error ('Failed to fetch heroes');
  }

  return await responce.json();
}
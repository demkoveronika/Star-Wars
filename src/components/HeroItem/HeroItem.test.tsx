import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HeroItem } from "./HeroItem";
import { fetchFilmsForHeroes, fetchHeroById, fetchShipsForHeroes } from "../../api/starWarsApi";
import data from "../../dataTest.json";

const { heroData, filmsData, starshipsData } = data;

jest.mock('../../api/starWarsApi', () => ({
  fetchHeroById: jest.fn(),
  fetchFilmsForHeroes: jest.fn(),
  fetchShipsForHeroes: jest.fn(),
}));

const mockHero = heroData;
const mockFilms = filmsData;
const mockShips = starshipsData;

describe('HeroItem', () => {
  const heroId = 10;

  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loader while loading', () => {
    // (fetchHeroById as jest.Mock).mockImplementation(() => 
    //   new Promise(() => {}));

    const loadingPromise = new Promise(() => {}); 
    (fetchHeroById as jest.Mock).mockImplementation(() => loadingPromise);

    render(
      <MemoryRouter initialEntries={[`/hero/${heroId}`]}>
        <Routes>
          <Route path="/hero/:heroId" element={<HeroItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders hero details and fetches data on hero click', async () => {
    (fetchHeroById as jest.Mock).mockResolvedValue(mockHero);
    (fetchFilmsForHeroes as jest.Mock).mockResolvedValue(mockFilms);
    (fetchShipsForHeroes as jest.Mock).mockResolvedValue(mockShips);

    render(
      <MemoryRouter initialEntries={[`/hero/${heroId}`]}>
        <Routes>
          <Route path="/hero/:heroId" element={<HeroItem />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => expect(fetchHeroById).toHaveBeenCalledWith(Number(heroId)));

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();

    expect(screen.getByText(mockHero.name)).toBeInTheDocument();

    mockHero.films.forEach(filmId => {
      const film = mockFilms.find(f => f.episode_id === filmId)!;
      expect(film).toBeDefined();
      expect(screen.getByText(film.title)).toBeInTheDocument();
    });

    mockShips.forEach(ship => {
      expect(screen.getByText(ship.name)).toBeInTheDocument();
    });
  });
});
import { render, cleanup, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { HeroList } from './HeroList';
import { fetchHeroes } from '../../api/starWarsApi';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../api/starWarsApi', () => ({
  fetchHeroes: jest.fn(),
}));

describe('HeroList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const generateMockHeroes = (num: number) => {
    return Array.from({ length: num }, (_, index) => ({
      id: index + 1,
      name: `Hero ${index + 1}`,
    }));
  };

  const mockHeroes = generateMockHeroes(82);

  beforeEach(() => {
    (fetchHeroes as jest.Mock).mockResolvedValue({ results: mockHeroes.slice(0, 10) });
  });

  afterEach(cleanup);

  it('should load heroes on initial render', async () => {
    (fetchHeroes as jest.Mock).mockResolvedValueOnce({ results: mockHeroes.slice(0, 10) });
  
    render(
      <MemoryRouter>
        <HeroList />
      </MemoryRouter>
    );
  
    const heroes = await screen.findAllByTestId('hero-name');
  
    expect(heroes).toHaveLength(10);
  });

  it('should load more heroes on scroll when hasMore is true', async () => {
    (fetchHeroes as jest.Mock).mockResolvedValueOnce({ results: mockHeroes.slice(0, 10) });

    render(
      <MemoryRouter>
        <HeroList />
      </MemoryRouter>
    );

    window.innerHeight = 800;
    window.scrollY = 600;

    Object.defineProperty(document.body, 'offsetHeight', { 
      writable: false,
      value: 1000
    });

    fireEvent.scroll(window);

    (fetchHeroes as jest.Mock).mockResolvedValueOnce({ results: mockHeroes.slice(10, 20) });

    await waitFor(() => {
      const heroes = screen.getAllByTestId('hero-name');
      expect(heroes.length).toBeGreaterThan(0);
    });

    expect(fetchHeroes).toHaveBeenCalledTimes(2);
  });

  it('should not load more heroes if hasMore is false', async () => {
    (fetchHeroes as jest.Mock).mockResolvedValueOnce(mockHeroes).mockResolvedValueOnce([]);

    render(<HeroList />);

    window.innerHeight = 800;
    window.scrollY = 600;

    Object.defineProperty(document.body, 'offsetHeight', { 
      writable: false,
      value: 1000
    });

    fireEvent.scroll(window);

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
  });

  it('should remove scroll event listener on unmount', () => {
    const { unmount } = render(<HeroList />);
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should display Loader when loading', async () => {
    (fetchHeroes as jest.Mock).mockImplementation(() => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ results: [] });
        }, 1000);
      })
    );
  
    render(
      <MemoryRouter>
        <HeroList />
      </MemoryRouter>
    );
  
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });
});
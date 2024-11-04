import { render, screen } from '@testing-library/react';
import App from './App';

test('renders star wars logo image', () => {
  render(<App />);
  const imgElement = screen.getByAltText(/logo/i);
  expect(imgElement).toBeInTheDocument();
});

test('renders first star wars hero image', () => {
  render(<App />);
  const heroOneImage = screen.getByAltText(/hero-1/i);
  expect(heroOneImage).toBeInTheDocument();
});

test('renders second star wars hero image', () => {
  render(<App />);
  const heroTwoImage = screen.getByAltText(/hero-2/i);
  expect(heroTwoImage).toBeInTheDocument();
});
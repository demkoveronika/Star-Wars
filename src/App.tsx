import './App.css';
import { HeroList } from './components/HeroList/HeroList';
import starWarsLogo from './img/star-wars-logo.svg';
import starWarsHeroOne from './img/star-wars-hero-1.svg';
import starWarsHeroTwo from './img/star-wars-hero-2.svg';

function App() {
  return (
    <div className="App">
      <header className='header'>
        <img className='header__hero' src={starWarsHeroOne} alt="hero-1" />
        <img className='header__logo' src={starWarsLogo} alt="logo" />
        <img className='header__hero' src={starWarsHeroTwo} alt="hero-2" />
      </header>
      <main>
        <HeroList />
      </main>
    </div>
  );
}

export default App;

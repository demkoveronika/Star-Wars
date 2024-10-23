import './App.css';
import { HeroList } from './components/HeroList/HeroList';
import starWarsLogo from './img/star-wars-logo.svg';

function App() {
  return (
    <div className="App">
      <header className='header'>
        <img className='header__logo' src={starWarsLogo} alt="logo" />
      </header>
      <main>
        <HeroList />
      </main>
    </div>
  );
}

export default App;

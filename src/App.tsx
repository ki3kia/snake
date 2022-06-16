import './App.css';
import './pokemon.css';
import './game.css';
import { Pokemon, PokemonList } from './PokemonList';
import { useRef, useState } from 'react';
import { SnakeStates } from './Snake';

function App(): JSX.Element {
  const [pokemon, setPokemon] = useState<Pokemon['id']>(1);
  const [isOnGame, setIsOnGame] = useState(false);

  const nextClick = () => {
    const selectPokeSection: HTMLElement | null = document.getElementById('pokemonChoose');
    if (!selectPokeSection || !pokemon) return;
    selectPokeSection.style.animation = 'closeChooseBox 2s';
    setTimeout(() => {
      selectPokeSection.remove();
      setIsOnGame(true);
    }, 2000);
  };

  return (
    <div className='App'>
      {
        <div id={'pokemonChoose'}>
          <PokemonList pokemonId={pokemon} onSelectPokemon={setPokemon} />
          <button key='next' onClick={nextClick}>
            {'Play \u25B6'}
          </button>
        </div>
      }
      {isOnGame ? <SnakeStates pokemonId={pokemon} /> : <></>}
    </div>
  );
}

export default App;

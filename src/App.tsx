import './App.css';
import './pokemon.css';
import './game.css';
import { Pokemon, PokemonList } from './PokemonList';
import { useState } from 'react';
import { SnakeStates } from './Snake';

function App(): JSX.Element {
  const [pokemon, setPokemon] = useState<Pokemon['id']>(1);
  const [isOnGame, setIsOnGame] = useState(false);

  const nextClick = () => {
    setIsOnGame(true);
  };

  return (
    <div className='App'>
      {isOnGame ? (
        <SnakeStates pokemonId={pokemon} />
      ) : (
        <div id={'pokemonChoose'}>
          <PokemonList pokemonId={pokemon} onSelectPokemon={setPokemon} />
          <button key='next' onClick={nextClick}>
            {'Play \u25B6'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

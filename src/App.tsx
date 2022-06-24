import './App.css';
import './pokemon.css';
import './game.css';
import { Pokemon, PokemonList } from './PokemonList';
import { useState } from 'react';
import { SnakeStates } from './Snake';

function App(): JSX.Element {
  const [pokemon, setPokemon] = useState<Pokemon['id']>(1);
  const [isOnGame, setIsOnGame] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const nextClick = () => {
    setIsOnGame(true);
  };

  const pauseHandler = () => {
    setIsPaused((prev) => !prev);
  };

  if (isOnGame) {
    return (
      <div className='App'>
        {isPaused ? (
          <div className={'pause'}>
            <button className={'play'} onClick={pauseHandler}>
              {'\u25B6'}
            </button>
          </div>
        ) : (
          <div className={'play'}>
            <button className={'pause'} onClick={pauseHandler}>
              {'\u2759 \u2759'}
            </button>
          </div>
        )}
        <SnakeStates pokemonId={pokemon} isPaused={isPaused} setIsOnGame={setIsOnGame} />
      </div>
    );
  }

  return (
    <div className='App'>
      <div id={'pokemonChoose'}>
        <PokemonList pokemonId={pokemon} onSelectPokemon={setPokemon} />
        <button className='next' onClick={nextClick}>
          {'Play \u25B6'}
        </button>
      </div>
    </div>
  );
}

export default App;

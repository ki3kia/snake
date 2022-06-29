import './App.css';
import './pokemon.css';
import './game.css';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/hands';

import { Pokemon, PokemonList } from './PokemonList';
import { useRef, useState } from 'react';
import { SnakeStates } from './Snake';
import { CameraControl } from './Camera';

function App(): JSX.Element {
  const [pokemon, setPokemon] = useState<Pokemon['id']>(1);
  const [isOnGame, setIsOnGame] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const checkRef = useRef<HTMLInputElement>(null);
  const [isUseCamera, setIsUseCamera] = useState(false);

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
        <SnakeStates
          pokemonId={pokemon}
          isPaused={isPaused}
          onEndGame={() => {
            setIsOnGame(false);
          }}
        />
        <input
          type={'checkbox'}
          ref={checkRef}
          key={'isCameraControl'}
          id={'isCameraControl'}
          onChange={() => setIsUseCamera((prev) => !prev)}
        />
        <label htmlFor={'isCameraControl'}>Use camera for control</label>
        {isUseCamera ? <CameraControl /> : null}
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

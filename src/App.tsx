import './App.css';
import './pokemon.css';
import './game.css';

import { Pokemon, PokemonList } from './PokemonList';
import { useEffect, useState } from 'react';
import { SnakeStates, INITIAL_DIRECTION } from './Snake';
import { CameraControl } from './Camera';
import { Point } from './gameUtils';

function App(): JSX.Element {
  const [pokemon, setPokemon] = useState<Pokemon['id']>(1);
  const [cameraDirection, setCameraDirection] = useState(INITIAL_DIRECTION);
  const [isOnGame, setIsOnGame] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isUseCamera, setIsUseCamera] = useState(false);

  const nextClick = () => {
    setIsOnGame(true);
  };

  const pauseHandler = () => {
    setIsPaused((prev) => !prev);
  };

  const handleCameraDirection = (direction: Point) => {
    if (isPaused) return;
    setCameraDirection((prev) => {
      if (!prev) return direction;

      return prev.x === direction.x || prev.y === direction.y ? prev : direction;
    });
  };

  useEffect(() => {
    if (isOnGame) return;
    setIsUseCamera(false);
    setCameraDirection(INITIAL_DIRECTION);
    setIsPaused(true);
  }, [isOnGame]);

  if (isOnGame) {
    return (
      <div className='App'>
        {isPaused ? (
          <div className='pause'>
            <button className='play' onClick={pauseHandler}>
              {'\u25B6'}
            </button>
          </div>
        ) : (
          <div className='play'>
            <button className='pause' onClick={pauseHandler}>
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
          cameraDirection={cameraDirection}
        />
        <div className='videoBlock'>
          <div>
            <input
              type='checkbox'
              key='isCameraControl'
              id='isCameraControl'
              onChange={() => setIsUseCamera(!isUseCamera)}
            />
            <label htmlFor='isCameraControl'>Use camera for control</label>
          </div>
          {isUseCamera ? <CameraControl onChangeDirection={handleCameraDirection} /> : undefined}
        </div>
      </div>
    );
  }

  return (
    <div className='App'>
      <PokemonList pokemonId={pokemon} onSelectPokemon={setPokemon} />
      <button className='next' onClick={nextClick}>
        {'Play \u25B6'}
      </button>
    </div>
  );
}

export default App;

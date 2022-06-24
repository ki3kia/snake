import { useEffect, useRef, useState } from 'react';
import { Pokemon } from './PokemonList';
import { Point, generatePointOutSnakeBody, moveSnake } from './gameUtils';

type Props = {
  pokemonId: Pokemon['id'];
};

const INITIAL_SNAKE_BODY = [
  { x: 4, y: 11 },
  { x: 3, y: 11 },
];

export const SnakeStates = ({ pokemonId }: Props): JSX.Element => {
  const [gameState, setGameState] = useState({
    snakeBody: INITIAL_SNAKE_BODY,
    food: generatePointOutSnakeBody(INITIAL_SNAKE_BODY),
    stepTimeInterval: 200,
  });
  const directionRef = useRef<Point>({ x: 1, y: 0 });

  const getElementPositionStyle = (element: Point) => {
    return {
      gridRowStart: element.y,
      gridColumnStart: element.x,
    };
  };

  useEffect(() => {
    const keyPressHandler = (ev: KeyboardEvent) => {
      switch (ev.code) {
        case 'ArrowUp':
          if (directionRef.current.y == 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y == 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x == 0) directionRef.current = { x: 1, y: 0 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x == 0) directionRef.current = { x: -1, y: 0 };
          break;
      }
    };
    window.addEventListener('keydown', keyPressHandler);
    return () => window.removeEventListener('keydown', keyPressHandler);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGameState((prev) => {
        const moveSnakeResp = moveSnake(prev.snakeBody, directionRef.current, prev.food);
        const food = moveSnakeResp.isEaten ? generatePointOutSnakeBody(moveSnakeResp.snake) : prev.food;
        const stepTimeInterval = moveSnakeResp.isEaten ? prev.stepTimeInterval - 1 : prev.stepTimeInterval;
        return { snakeBody: moveSnakeResp.snake, food, stepTimeInterval };
      });
    }, gameState.stepTimeInterval);
    return () => clearInterval(intervalId);
  }, [gameState.stepTimeInterval]);

  return (
    <div className={'game-board'}>
      {gameState.snakeBody.map((segment, key) => {
        const styleSnake =
          key === 0
            ? {
                ...getElementPositionStyle(segment),
                backgroundImage: `url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
                  pokemonId ?? 1
                }.svg)`,
                backgroundColor: 'inherit',
              }
            : getElementPositionStyle(segment);

        return <div key={key} className={'snake-body'} style={styleSnake} />;
      })}

      {gameState.food ? <div key={'food'} className={'food'} style={getElementPositionStyle(gameState.food)} /> : null}
    </div>
  );
};

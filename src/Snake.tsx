import { useEffect, useRef, useState } from 'react';
import { Pokemon } from './PokemonList';
import { Point, generatePointOutSnakeBody, moveSnake, isDied, isWin } from './gameUtils';

type Props = {
  pokemonId: Pokemon['id'];
  isPaused: boolean;
  onEndGame: () => void;
  cameraDirection: Point;
};
type Food = {
  good: Point;
  bad: Point;
};
type GameState = {
  snakeBody: Point[];
  food: Food;
  stepTimeInterval: number;
};

const INITIAL_SNAKE_BODY = [
  { x: 4, y: 11 },
  { x: 3, y: 11 },
];

const INITIAL_STEP_TIME_INTERVAL = 200;
export const INITIAL_DIRECTION: Point = { x: 1, y: 0 };
const INITIAL_FOOD = {
  good: { x: 20, y: 9 },
  bad: { x: 20, y: 13 },
};

export const SnakeStates = ({ pokemonId, isPaused, onEndGame, cameraDirection }: Props): JSX.Element => {
  const [gameState, setGameState] = useState<GameState>({
    snakeBody: INITIAL_SNAKE_BODY,
    food: INITIAL_FOOD,
    stepTimeInterval: INITIAL_STEP_TIME_INTERVAL,
  });

  const directionRef = useRef<Point>(INITIAL_DIRECTION);

  const getElementPositionStyle = (element: Point) => {
    return {
      gridRowStart: element.y,
      gridColumnStart: element.x,
    };
  };

  directionRef.current = cameraDirection;

  useEffect(() => {
    if (isPaused) return;
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
  }, [isPaused]);

  useEffect(() => {
    if (isPaused) return;
    const intervalId = setInterval(() => {
      setGameState((prev) => {
        const moveSnakeResp = moveSnake(prev.snakeBody, directionRef.current, prev.food.good);
        const good =
          moveSnakeResp.isEaten && !isWin(moveSnakeResp.snake)
            ? generatePointOutSnakeBody(moveSnakeResp.snake)
            : prev.food.good;
        const bad =
          moveSnakeResp.isEaten && !isWin(moveSnakeResp.snake)
            ? generatePointOutSnakeBody(moveSnakeResp.snake, good)
            : prev.food.bad;
        const stepTimeInterval = moveSnakeResp.isEaten ? prev.stepTimeInterval - 1 : prev.stepTimeInterval;
        const food: Food = { good, bad };
        return { snakeBody: moveSnakeResp.snake, food, stepTimeInterval };
      });
    }, gameState.stepTimeInterval);
    return () => clearInterval(intervalId);
  }, [isPaused, gameState.stepTimeInterval]);

  useEffect(() => {
    if (isDied(gameState.snakeBody, gameState.food.bad)) {
      onEndGame();
      directionRef.current = INITIAL_DIRECTION;
    }
  }, [gameState.snakeBody, gameState.food, onEndGame]);

  return (
    <div className='game-board'>
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

        return <div key={key} className='snake-body' style={styleSnake} />;
      })}

      <div key='good_food' className='food good' style={getElementPositionStyle(gameState.food.good)} />
      <div key='bad_food' className='food bad' style={getElementPositionStyle(gameState.food.bad)} />
    </div>
  );
};

import { useEffect, useState } from 'react';
import { Pokemon } from './PokemonList';

type Point = {
  x: number;
  y: number;
};
type Props = {
  pokemonId: Pokemon['id'];
};

const GRID_ROWS_SIZE = 21;
const GRID_COLUMNS_SIZE = 25;

export const SnakeStates = ({ pokemonId }: Props): JSX.Element => {
  const [speed, setSpeed] = useState(6);
  const [snakeBody, setSnakeBody] = useState<Point[]>([
    { x: 4, y: 11 },
    { x: 3, y: 11 },
  ]);
  const [food, setFood] = useState<Point>(generatePointOutSnakeBody(snakeBody));
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
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
          setDirection((prev) => {
            return prev.y !== 0 ? prev : { x: 0, y: -1 };
          });
          break;
        case 'ArrowDown':
          setDirection((prev) => {
            return prev.y !== 0 ? prev : { x: 0, y: 1 };
          });
          break;
        case 'ArrowRight':
          setDirection((prev) => {
            return prev.x !== 0 ? prev : { x: 1, y: 0 };
          });
          break;
        case 'ArrowLeft':
          setDirection((prev) => {
            return prev.x !== 0 ? prev : { x: -1, y: 0 };
          });
          break;
      }
    };
    window.addEventListener('keydown', keyPressHandler);

    return () => window.removeEventListener('keydown', keyPressHandler);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnakeBody((prev) => {
        const newHeadPos = getPointOutOfGameBoard({ x: prev[0].x + direction.x, y: prev[0].y + direction.y });
        if (prev.length > 1) prev.pop();
        return [newHeadPos, ...prev];
      });
    }, 1000 / speed);
    return () => clearInterval(intervalId);
  }, [direction, speed]);

  return (
    <div className={'game-board'}>
      {snakeBody.map((segment, key) => {
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

      <div key={'food'} className={'food'} style={getElementPositionStyle(food)} />
    </div>
  );
};

const generatePointOutSnakeBody = (snakeBody: Point[]) => {
  let randomPoint: Point;
  do {
    randomPoint = {
      x: Math.floor(Math.random() * GRID_COLUMNS_SIZE) + 1,
      y: Math.floor(Math.random() * GRID_ROWS_SIZE) + 1,
    };
  } while (isPointOutOfSnake(snakeBody, randomPoint));

  return randomPoint;
};

const isPointOutOfSnake = (snake: Point[], point: Point) => {
  return snake.some((segment) => segment.x === point.x && segment.y === point.y);
};

const isEaten = (snake: Point[], food: Point) => {
  return snake[0].x === food.x && snake[0].y === food.y;
};

const getPointOutOfGameBoard = ({ x, y }: Point): Point => {
  return {
    x: x ? Math.abs(x % (GRID_COLUMNS_SIZE + 1)) : GRID_COLUMNS_SIZE,
    y: y ? Math.abs(y % (GRID_ROWS_SIZE + 1)) : GRID_ROWS_SIZE,
  };
};

import { useEffect, useRef, useState } from 'react';
import { Pokemon } from './PokemonList';

type Point = {
  x: number;
  y: number;
};

const GRID_SIZE = 21;

export const SnakeStates = ({ pokemonId }: { pokemonId: Pokemon['id'] }): JSX.Element => {
  const [snakeBody, setSnakeBody] = useState<Point[]>([
    { x: 11, y: 4 },
    { x: 11, y: 3 },
  ]);
  const [food, setFood] = useState<Point>(generatePointOutSnakeBody(snakeBody));

  const getElementPositionStyle = (element: Point) => {
    return {
      gridRowStart: element.x,
      gridColumnStart: element.y,
    };
  };

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
      x: Math.floor(Math.random() * GRID_SIZE) + 1,
      y: Math.floor(Math.random() * GRID_SIZE) + 1,
    };
  } while (isPointOutOfSnake(snakeBody, randomPoint));

  return randomPoint;
};

const isPointOutOfSnake = (snake: Point[], point: Point) => {
  return snake.every((segment) => segment.x === point.x && segment.y === point.y);
};

const isEaten = (snake: Point[], food: Point) => {
  return snake[0].x === food.x && snake[0].y === food.y;
};

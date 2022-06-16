import { useEffect, useRef, useState } from 'react';
import { Pokemon } from './PokemonList';

type Point = {
  x: number;
  y: number;
};

const GRID_SIZE = 21;

export const SnakeStates = ({ pokemonId }: { pokemonId: Pokemon['id'] }): JSX.Element => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [snakeBody, setSnakeBody] = useState<Point[]>([
    { x: 11, y: 4 },
    { x: 11, y: 3 },
  ]);
  const [food, setFood] = useState<Point>(generatePointOutSnakeBody(snakeBody));

  const elementStyles = (element: Point) => {
    return {
      gridRowStart: element.x,
      gridColumnStart: element.y,
    };
  };

  return (
    <div className={'game-board'} ref={boardRef}>
      {snakeBody.map((segment, key) => {
        const styleSnake =
          key === 0
            ? {
                ...elementStyles(segment),
                backgroundImage: `url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
                  pokemonId ?? 1
                }.svg)`,
                backgroundColor: 'inherit',
              }
            : elementStyles(segment);

        return <div key={`snake-body-${key + 1}`} className={'snake-body'} style={styleSnake} />;
      })}

      <div key={'food'} className={'food'} style={elementStyles(food)} />
    </div>
  );
};

const generatePointOutSnakeBody = (snakeBody: Point[]) => {
  let randomPoint: Point = {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  };
  snakeBody.forEach((segment) => {
    if (segment.x === randomPoint.x && segment.y === randomPoint.y) {
      randomPoint = generatePointOutSnakeBody(snakeBody);
    }
  });
  return randomPoint;
};

const outsideBoard = (point: Point) => {
  if (point.x < 1 || point.x > GRID_SIZE) point.x %= GRID_SIZE;
  if (point.y < 1 || point.y > GRID_SIZE) point.y %= GRID_SIZE;
};

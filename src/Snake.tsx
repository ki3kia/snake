import { useEffect, useRef, useState } from 'react';
import { Pokemon } from './PokemonList';
import { Point, generatePointOutSnakeBody, moveSnake } from './gameUtils';

type Props = {
  pokemonId: Pokemon['id'];
};

export const SnakeStates = ({ pokemonId }: Props): JSX.Element => {
  const [stepTimeInterval, setStepTimeInterval] = useState(200);
  const [snakeBody, setSnakeBody] = useState<Point[]>([
    { x: 4, y: 11 },
    { x: 3, y: 11 },
  ]);
  const [food, setFood] = useState<Point>();
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
    let isEaten = false;
    const intervalId = setInterval(() => {
      setSnakeBody((prev) => {
        const moveResult = moveSnake(prev, directionRef.current, food);
        isEaten = moveResult.isAte;
        return moveResult.snake;
      });
      if (isEaten) {
        setFood(undefined);
        setStepTimeInterval((prev) => prev - 1);
      }
    }, stepTimeInterval);
    return () => clearInterval(intervalId);
  }, [stepTimeInterval, food]);

  useEffect(() => {
    if (!food) {
      setFood(generatePointOutSnakeBody(snakeBody));
      setStepTimeInterval((prev) => prev - 1);
    }
  }, [snakeBody, food]);

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

      {food ? <div key={'food'} className={'food'} style={getElementPositionStyle(food)} /> : null}
    </div>
  );
};

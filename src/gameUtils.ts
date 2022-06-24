export type Point = {
  x: number;
  y: number;
};

export const GRID_ROWS_SIZE = 21;
export const GRID_COLUMNS_SIZE = 25;

export const generatePointOutSnakeBody = (snakeBody: Point[]): Point => {
  let randomPoint: Point;
  do {
    randomPoint = {
      x: Math.floor(Math.random() * GRID_COLUMNS_SIZE) + 1,
      y: Math.floor(Math.random() * GRID_ROWS_SIZE) + 1,
    };
  } while (isPointOnSnake(snakeBody, randomPoint));

  return randomPoint;
};

export const isPointOnSnake = (snake: Point[], point: Point): boolean => {
  return snake.some((segment) => segment.x === point.x && segment.y === point.y);
};

const isFoodEaten = (snake: Point[], food: Point): boolean => {
  return snake[0].x === food.x && snake[0].y === food.y;
};

const getPointOutOfGameBoard = ({ x, y }: Point): Point => {
  return {
    x: x ? Math.abs(x % (GRID_COLUMNS_SIZE + 1)) : GRID_COLUMNS_SIZE,
    y: y ? Math.abs(y % (GRID_ROWS_SIZE + 1)) : GRID_ROWS_SIZE,
  };
};

type moveSnakeResp = {
  snake: Point[];
  isEaten: boolean;
};
export const moveSnake = (snake: Point[], direction: Point, food: Point): moveSnakeResp => {
  const newBody = [getPointOutOfGameBoard({ x: snake[0].x + direction.x, y: snake[0].y + direction.y }), ...snake];
  const isEaten = isFoodEaten(newBody, food);
  if (!isEaten) newBody.pop();

  return { snake: newBody, isEaten };
};

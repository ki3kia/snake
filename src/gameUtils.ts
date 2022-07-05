import { Hand } from '@tensorflow-models/hand-pose-detection';

export type Point = {
  x: number;
  y: number;
};

export const GRID_ROWS_SIZE = 21;
export const GRID_COLUMNS_SIZE = 25;
const SIN_VERTICAL = Math.sin(Math.PI / 3);
const COS_HORIZONTAL = Math.cos(Math.PI / 4);

export const getDirectionByHandsPose = (hand: Hand): Point | undefined => {
  const handelPoint1 = hand.keypoints[9];
  const handelPoint2 = hand.keypoints[12];
  const vector = { x: handelPoint1.x - handelPoint2.x, y: handelPoint1.y - handelPoint2.y };

  const vectorModule = (vector.x ** 2 + vector.y ** 2) ** (1 / 2);

  const cosVector = vector.x / vectorModule;
  const sinVector = vector.y / vectorModule;

  if (vectorModule < 70) return undefined;

  if (cosVector > COS_HORIZONTAL) {
    return { x: 1, y: 0 };
  }

  if (cosVector < -COS_HORIZONTAL) {
    return { x: -1, y: 0 };
  }

  if (sinVector > SIN_VERTICAL) {
    return { x: 0, y: -1 };
  }

  if (sinVector < -SIN_VERTICAL) {
    return { x: 0, y: 1 };
  }
};

export const isDied = (snake: Point[], badFood: Point): boolean => {
  return isPointOnSnake(snake, snake[0], true) || (snake[0].x === badFood.x && snake[0].y === badFood.y);
};

export const isWin = (snake: Point[]): boolean => {
  return snake.length === GRID_ROWS_SIZE * GRID_COLUMNS_SIZE;
};

export const generatePointOutSnakeBody = (snakeBody: Point[], point?: Point): Point => {
  let randomPoint: Point, isNotUniquePoint: boolean;
  do {
    randomPoint = {
      x: Math.floor(Math.random() * GRID_COLUMNS_SIZE) + 1,
      y: Math.floor(Math.random() * GRID_ROWS_SIZE) + 1,
    };
    isNotUniquePoint = point ? randomPoint.x === point.x && randomPoint.y === point.y : false;
  } while (isPointOnSnake(snakeBody, randomPoint) || isNotUniquePoint);

  return randomPoint;
};

export const isPointOnSnake = (snake: Point[], point: Point, isIgnoreHead = false): boolean => {
  return snake.some((segment, key) => {
    if (isIgnoreHead && key === 0) return false;
    return segment.x === point.x && segment.y === point.y;
  });
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
export const moveSnake = (snake: Point[], direction: Point, food: Point | undefined): moveSnakeResp => {
  const newBody = [getPointOutOfGameBoard({ x: snake[0].x + direction.x, y: snake[0].y + direction.y }), ...snake];
  const isEaten = food !== undefined && isFoodEaten(newBody, food);
  if (!isEaten) newBody.pop();

  return { snake: newBody, isEaten };
};

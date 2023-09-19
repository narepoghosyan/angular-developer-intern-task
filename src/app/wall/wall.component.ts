import { Component } from '@angular/core';

interface brick {
  id: number;
  color: string;
  colored: boolean;
}

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})
export class WallComponent {
  wallWidth = 1;
  wallHeight = 1;
  colorsCount = 1;
  invertDiagonal = false;
  bricks: brick[] = [];
  colors: string[] = [];

  createWall() {
    const bricksCount = this.wallWidth * this.wallHeight;

    this.bricks = [];
    this.colors = [];

    for(let i = 0; i < this.colorsCount; i++) {
      this.colors.push(this.getRandomColor());
    }

    for(let i = 1; i <= bricksCount; i++) {
      const brick = {
        id: i,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        colored: false,
      }

      this.bricks.push(brick);
    }
  }

  brickClicked(brickId: number) {
    if (this.invertDiagonal) {
      const brickIds = this.bricks.map(brick => brick.id)
      const wallMatrix: number[][] = [];
      const cellX = brickId % this.wallWidth ? brickId % this.wallWidth - 1 : this.wallWidth - 1;
      const cellY = Math.ceil(brickId / this.wallWidth) - 1;

      while(brickIds.length) {
        wallMatrix.push(brickIds.splice(0,this.wallWidth)) // convert 1d array to 2d array
      }

      const diagonals = [
        ...this.getNorthWestDiagonal(cellX, cellY, wallMatrix),
        ...this.getNorthEastDiagonal(cellX, cellY, wallMatrix),
        ...this.getSouthWestDiagonal(cellX, cellY, wallMatrix),
        ...this.getSouthEastDiagonal(cellX, cellY, wallMatrix)
      ];

      this.bricks = this.bricks.map((brick, index) => {
        if (diagonals.includes(brick.id)) {
          return {...brick, colored: true};
        }

        return brick;
      })
    } else {
      const clickedRow = Math.ceil(brickId / this.wallWidth)

      this.bricks = this.bricks.map((brick) => {
        const isRowClicked = brick.id > (clickedRow - 1) * this.wallWidth && brick.id <= clickedRow * this.wallWidth;
        const isColumnClicked = brickId % this.wallWidth === brick.id % this.wallWidth;

        if (isRowClicked || isColumnClicked ) {
          return {...brick, colored: true}
        }

        return brick;
      })
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  getNorthWestDiagonal(cellX: number, cellY: number, matrix: number[][]){
    const result = [matrix[cellY][cellX]];
    let i = cellX;
    let j = cellY;

    while(i > 0 && j > 0) {
      i--;
      j--;
      result.push(matrix[j][i])
    }

    return result
  }

  getNorthEastDiagonal(cellX: number, cellY: number, matrix: number[][]) {
    const result = [];
    let i = cellX;
    let j = cellY;

    while(i < this.wallWidth && j > 0) {
      i++;
      j--;

      result.push(matrix[j][i])
    }

    return result;
  }

  getSouthWestDiagonal(cellX: number, cellY: number, matrix: number[][]) {
    const result = [];
    let i = cellX;
    let j = cellY;

    while(i >= 0 && j < this.wallHeight) {
      result.push(matrix[j][i])

      i--;
      j++;
    }

    return result;
  }

  getSouthEastDiagonal(cellX: number, cellY: number, matrix: number[][]) {
    const result = [];
    let i = cellX;
    let j = cellY;

    while(i < this.wallWidth && j < this.wallHeight) {
      result.push(matrix[j][i])

      i++;
      j++;
    }

    return result;
  }
}

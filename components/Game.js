import React, { useState, useEffect } from 'react';
import Board from './Board';

function Game({ boardSize, player1, player2, onGameOver }) {
    const [board, setBoard] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState('black');
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const initialBoard = Array.from({ length: boardSize }, () =>
            Array(boardSize).fill(null)
        );
        const mid = Math.floor(boardSize / 2);
        initialBoard[mid - 1][mid - 1] = 'white';
        initialBoard[mid][mid] = 'white';
        initialBoard[mid - 1][mid] = 'black';
        initialBoard[mid][mid - 1] = 'black';
        setBoard(initialBoard);
    }, [boardSize]);

    const handleCellClick = (row, col) => {
        if (board[row][col] || winner) return;

        const newBoard = board.map((row) => row.slice());
        const validMove = makeMove(newBoard, row, col, currentPlayer);

        if (validMove) {
            setBoard(newBoard);
            setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');

            if (checkGameOver(newBoard)) {
                const winner = calculateWinner(newBoard);
                setWinner(winner);
                onGameOver(winner);
            }
        }
    };

    const handleSurrender = () => {
        const winner = currentPlayer === 'black' ? 'white' : 'black';
        setWinner(winner);
        onGameOver(winner);
    };

    const makeMove = (board, row, col, player) => {
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        let validMove = false;

        for (let [dx, dy] of directions) {
            const cellsToFlip = [];
            let x = row + dx;
            let y = col + dy;
            while (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] && board[x][y] !== player) {
                cellsToFlip.push([x, y]);
                x += dx;
                y += dy;
            }
            if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === player && cellsToFlip.length > 0) {
                validMove = true;
                cellsToFlip.forEach(([fx, fy]) => {
                    board[fx][fy] = player;
                });
            }
        }

        if (validMove) {
            board[row][col] = player;
        }

        return validMove;
    };

    const checkGameOver = (board) => {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col] === null && (
                    canMove([...board], row, col, 'black') ||
                    canMove([...board], row, col, 'white')
                )) {
                    return false;
                }
            }
        }
        return true;
    };

    const canMove = (board, row, col, player) => {
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        for (let [dx, dy] of directions) {
            const cellsToFlip = [];
            let x = row + dx;
            let y = col + dy;
            while (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] && board[x][y] !== player) {
                cellsToFlip.push([x, y]);
                x += dx;
                y += dy;
            }
            if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === player && cellsToFlip.length > 0) {
                return true;
            }
        }
        return false;
    };

    const calculateWinner = (board) => {
        let blackCount = 0;
        let whiteCount = 0;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col] === 'black') blackCount++;
                if (board[row][col] === 'white') whiteCount++;
            }
        }
        return blackCount > whiteCount ? 'black' : 'white';
    };

    return (
        <div className="game">
            <h2>{currentPlayer === 'black' ? player1 : player2}のターン</h2>
            <Board board={board} onCellClick={handleCellClick} />
            <button onClick={handleSurrender}>降参</button>
            {winner && (
                <div className="winner">
                    勝者: {winner === 'black' ? player1 : player2}
                </div>
            )}
        </div>
    );
}

export default Game;
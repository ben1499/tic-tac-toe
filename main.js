const gameBoard = (function() {
    let _board = ['','','','','','','','',''];
    // 

    const getBoard = () => {
        return _board;
    }

    const resetBoard = () => {
        _board = ['','','','','','','','',''];
    }

    const updateBoard = (position, marker) => {
        if (_board[position] || gameController.wonStatus() || gameController.gameStatus() === false) {
            return;
        }
        else {
            _board[position] = marker;
            gameController.incrementMove();
            gameController.checkWin();
        }    
    }

    return {
        getBoard,
        updateBoard,
        resetBoard
    }
})();

const displayController = (function() {
    const board = document.querySelector('#game-board')
    const boardItems = document.querySelectorAll('.board-item')
    const result = document.querySelector('#result');
    const startBtn = document.querySelector('#start-btn');
    const controls = document.querySelector('.controls');
    const resetBtn = document.querySelector('#reset-btn');
    const restartBtn = document.querySelector('#restart-btn');
    const finalResult = document.querySelector('#final-result');
    const player1Score = document.querySelector('#player1score');
    const player2Score = document.querySelector('#player2score');
    const player1Name = document.querySelector('#player1name');
    const player2Name = document.querySelector('#player2name');
    const scoreBoard = document.querySelector('#scoreboard');
    const resetControls = document.querySelector('.reset-controls')


    startBtn.addEventListener('click', () => {
        let player1Input = document.querySelector('#player1').value;
        let player2Input = document.querySelector('#player2').value;
        const errorMsg = document.querySelector('.error');
        if (player1Input && player2Input) {
            scoreBoard.classList.add('show');
            errorMsg.classList.remove('show');
            player1Score.textContent = '0';
            player2Score.textContent = '0';
            gameController.createPlayers(player1Input, player2Input);
            gameController.startGame();
            controls.classList.toggle('hide');
            board.classList.add('show');
            resetControls.classList.add('show');
            player1Name.textContent = gameController.getPlayer1().getName();
            player2Name.textContent = gameController.getPlayer2().getName();
            
        } else {
            console.log("Error");
            errorMsg.classList.add('show');
        }
        document.querySelector('#player1').value = '';
        document.querySelector('#player2').value = '';
        
    })

    resetBtn.addEventListener('click', () => {
        gameBoard.resetBoard();
        gameController.resetMoves();
        gameController.resetPlayerCounters();
        gameController.startGame();
        result.textContent = '';
        player1Score.textContent = '0';
        player2Score.textContent = '0';
        displayFinalResult('');
        renderBoard();
    })

    restartBtn.addEventListener('click', () => {     
        gameBoard.resetBoard();
        gameController.resetMoves();
        gameController.resetPlayerCounters();
        result.textContent = '';
        renderBoard();
        gameController.endGame();
        controls.classList.toggle('hide');
        board.classList.remove('show');
        scoreBoard.classList.remove('show');
        resetControls.classList.remove('show');
    })


    const sendIndex = (e) => {
        gameController.makeMove(e.target.dataset.index);
        renderBoard();
    }

    const displayResult = (resultMsg) => {
        result.textContent = resultMsg;
    }

    const displayFinalResult = (resultMsg) => {
        finalResult.textContent = resultMsg;
    }

    const displayScores = (player1, player2) => {
        player1Score.textContent = gameController.getScore(player1);
        player2Score.textContent = gameController.getScore(player2);
    }


    const renderBoard = () => {
        const boardArray = gameBoard.getBoard();
        boardItems.forEach((displayItem, index) => {
            displayItem.textContent = boardArray[index];
            displayItem.addEventListener('click', sendIndex);
        })
    }

    return {
        renderBoard,
        displayResult,
        displayFinalResult,
        displayScores,
    }
    

})();

displayController.renderBoard();


const gameController = (function() {
    let _moveNumber = 0;
    let _isWon = false;
    let _isGameStart = false;
    let xWinCounter = 0;
    let yWinCounter = 0;

    const gameStatus = () => {
        return _isGameStart;
    }

    const startGame = () => {
        return _isGameStart = true;
    }

    const endGame = () => {
        return _isGameStart = false;
    }

    let player1;
    let player2;

    const createPlayers = (player1Name, player2Name) => {
        player1 = Player(player1Name, 'x');
        player2 = Player(player2Name, 'o');
    }

    const getPlayer1 = () => player1;

    const getPlayer2 = () => player2;


    const incrementMove = () => {
        _moveNumber++;
    }

    const resetMoves = () => {
        _moveNumber = 0;
    }

    const getMoves = () => {
        return _moveNumber;
    }

    const getScore = (playerCounter) => {
        return playerCounter;
    }

    const makeMove = (index) => {
        if (_isGameStart) {
            if (_moveNumber % 2 === 0) {
                player1.playMove(index);
            } else {
                player2.playMove(index);
            }
        } else {
            return;
        }
        
    }

    const wonStatus = () => {
        return _isWon;
    }

    const resetPlayerCounters = () => {
        xWinCounter = 0;
        yWinCounter = 0;
    }

    const checkWin = () => {
        const board = gameBoard.getBoard();
        const combos = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6]];

        for (let [a,b,c] of combos) {
            if (board[a] === 'x' && board[b] === 'x' && board[c] === 'x') {
                xWinCounter++;
                // _isWon = true;  
                
                if (xWinCounter < 3) {
                    displayController.displayResult(`${getPlayer1().getName()}(X) wins this round`);
                    setTimeout(() => {
                        displayController.displayResult('');
                    },1500)
                    gameBoard.resetBoard();
                }
                resetMoves();
            } else if (board[a] === 'o' && board[b] === 'o' && board[c] === 'o') {
                yWinCounter++;
                // _isWon = true;
                
                if (yWinCounter < 3) {
                    displayController.displayResult(`${getPlayer2().getName()}(O) wins this round`);
                    setTimeout(() => {
                        displayController.displayResult('');
                    },1500)
                    gameBoard.resetBoard();
                }
                resetMoves();
            }
        }
        if (_moveNumber === 9 && _isWon === false) {
            displayController.displayResult("It's a tie");
            gameBoard.resetBoard();
        }
        if (xWinCounter === 3 || yWinCounter === 3) {
            endGame();
            if (xWinCounter === 3) {
                displayController.displayFinalResult(`${getPlayer1().getName()} wins the game!`)
            } else if(yWinCounter === 3) {
                displayController.displayFinalResult(`${getPlayer2().getName()} wins the game!`)
            }

        }
        displayController.displayScores(xWinCounter, yWinCounter);
    }

    return {
        getMoves,
        makeMove,
        incrementMove,
        checkWin,
        wonStatus,
        gameStatus,
        createPlayers,
        startGame,
        endGame,
        resetMoves,
        resetPlayerCounters,
        getScore,
        getPlayer1,
        getPlayer2,
    }
})();


const Player = (name, marker) => {

    const getName = () => name;

    const getMarker = () => marker;

    const playMove = (index) => {
        gameBoard.updateBoard(index, marker)
    }

    return {
        getName,
        getMarker,
        playMove
    }
}

// function createPlayers(player1Name, player2Name) {
//     const player1 = Player('Jack', 'x');
//     const player2 = Player("Jim", 'o');
// }


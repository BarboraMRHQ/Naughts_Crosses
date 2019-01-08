import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { //props has value and onClick which is defined in renderSquare in Board line 20 & 21
  return (
      <button 
          className="square" 
          onClick={props.onClick} //takes in the function defined in renderSquare when clicked
      >
          {props.value}  
      </button> //displays value (X or O) which was passed down from Board (renderSquare)
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square //the props for this come from Game on line 93
          value={this.props.squares[i]} //gets the values to display from Game through properties. These are from an array, each square getting the corresponding index
          onClick={()=> this.props.onClick(i)} //state handling is in Game, so onCLick gets passed up again (with the squares ref number)
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) { //constructors initialise state
    super(props);//Game keeps track of what Squares have been clicked, and which player is next
    this.state = {
      history: [{
        squares:Array(9).fill(null), //initial state of game, nothing in the squares
      }],
      stepNumber: 0, //no moves have been made yet
      xIsNext:true, //X starts
    };
  }

  handleClick(i) {
    const history= this.state.history.slice(0, this.state.stepNumber + 1);
    const current= history[history.length-1];
    const squares = current.squares.slice();//make a copy of the existing game array

    if (calculateWinner(squares)||squares[i]){//don't do anything if occupied square or game already won
        return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'; //insert X if X is next, otherwise O
    this.setState({
        history:history.concat([{//states have to be immutable, so instead of adding directly to history, a copy is made then edited, then overwrites
          squares: squares,//added to history is the current move - note the difference between squares in state and local squares
        }]),
        stepNumber:history.length,
        xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber:step, //step is an array?
      xIsNext: (step % 2) === 0, //checking if step is even???
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner =calculateWinner(current.squares);

    const moves = history.map((step, move) => {//step is every element value of history (a nested array of 9) and move is the index of the element that is being iterated through
      const desc = move ? `Go to move #${move}` : `Go to game start`; //if 0, it is only the initial empty board. after each click on the board, a new array of 9 is added to history, thus giving a new index for a new move
      return (//each list item needs a key to uniquely identify it for rendering something that can change
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner) {
        status = `Winner: ${winner}`;
    } else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}//board is given the last value in history as the values to display in each square
            onClick={(i) => this.handleClick(i)}//onClick event gets passed from Square to Board to Game and is then handled. i is accepted as a parameter, so that the correct square can be updated.
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],//all winning combos
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let threeinarow = null;//no winning move by default
  lines.forEach((element) => {//iterate all the winning combos
    const [a, b, c] = element;//check if the squares have the same real values in them (not empty)
    if (squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c])) {
      threeinarow = squares[a];//identify winner
      return false; //breaks out of iterations
    }
  });
  return threeinarow;
}
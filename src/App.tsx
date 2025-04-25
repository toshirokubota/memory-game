import { useState } from 'react'
import './App.css'
import StartGameCard from './components/StartGameCard'
import MemoryGame from './components/MemoryGame';

export type NumPlayers = 1 | 2 | 3 | 4;
export type GridSize = 4 | 6;
export type GameOption = {
  theme: "numbers" | "icons",
  num_players: NumPlayers,
  grid_size: GridSize
}

function App() {
  const [gameOn, setGameOn] = useState<boolean>(false);
  const [gameOption, setGameOption] = useState<GameOption> ({theme: 'numbers', num_players: 1, grid_size: 4});
  return (
    <>
      {
        !gameOn && <StartGameCard setGameOn={setGameOn} setOption={setGameOption}/>
      }
      {
        gameOn && <MemoryGame option={gameOption} />
      }
    </>
  )
}

export default App

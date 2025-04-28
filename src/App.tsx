import { useState } from 'react'
import './App.css'
import StartGameCard from './components/StartGameCard'
import MemoryGame from './components/MemoryGame';

export type GameState = 'start-game' | 'playing' | 'matched' | 'mismatched' | 'end-game';

export type NumPlayers = 1 | 2 | 3 | 4;
export type GridSize = 4 | 6;
export type GameTheme = "numbers" | "icons"
export type GameOption = {
  theme: GameTheme,
  num_players: NumPlayers,
  grid_size: GridSize,
}


function App() {
  const [initialize, setInitialize] = useState<boolean>(true);
  const [gameOption, setGameOption] = useState<GameOption> ({theme: 'numbers', num_players: 1, grid_size: 4});
  const classStr: string = 'h-screen w-full ' + `${initialize ? 'bg-slate-800': 'bg-slate-50'}`;
  return (
    <div className={classStr}>
      {
        initialize && <StartGameCard initialize={setInitialize} setOption={setGameOption}/>
      }
      {
        !initialize && <MemoryGame option={gameOption} initialize={setInitialize}/>
      }
    </div>
  )
}

export default App

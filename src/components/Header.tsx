import React from 'react';
import RestartButton from './RestartButton';
import StartNewGameButton from './StartNewGameButton';
import { GameState } from '../App';

type Props = {
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    initialize: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header(props: Props) {
    return (
        <header className='flex justify-between m-4 py-2'>
            <h1>Memory</h1>
            <div>
                <button onClick={()=>props.setGameState('end-game')}
                    className='bg-slate-500 text-slate-50'>End Game</button>
                <RestartButton setGameState={props.setGameState}/>
                <StartNewGameButton initialize={props.initialize}/>
            </div>
        </header>
    )
}

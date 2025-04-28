import React, {useState} from 'react';
import RestartButton from './RestartButton';
import StartNewGameButton from './StartNewGameButton';
import { GameState } from '../App';

type Props = {
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    initialize: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header(props: Props) {
    const [openMenu, setOpenMenu] = useState(false);

    function PopupMenu() {
        return (
            <div className='overlay'>
                <div className='flex flex-col gap-4 items-center p-4 mx-6 my-24 rounded-xl bg-slate-100'>
                    {/* <button onClick={()=>props.setGameState('end-game')}
                        className='w-full bg-slate-500 text-slate-50 rounded-4xl py-4'>End Game</button> */}
                    <RestartButton setGameState={props.setGameState} more_styles={'w-full py-4'}/>
                    <StartNewGameButton initialize={props.initialize} more_styles={'w-full py-4'}/>
                    <button onClick={()=>setOpenMenu(false)}
                        className='w-full px-2 py-1/2 bg-slate-300 text-slate-800 font-bold rounded-4xl py-4'>
                        Resume Game
                    </button>
                </div>
            </div>
        )
    }

    return (
        <header className='flex justify-between mx-4 mb-8 py-4'>
            <h1 className={'text-slate-800 font-bold text-lg'}>Memory</h1>
            <div className='pop-up-menu'>
                <button 
                    className={'px-2 py-0.5 mx-1 bg-orange-400 rounded-4xl'}
                    onClick={()=>{setOpenMenu(true)}}>
                    Menu
                </button>
                {openMenu && <PopupMenu />}
            </div>
            <div className='static-menu'>
                <div className='flex flex-row gap-4 items-end'>
                    {/* <button onClick={()=>props.setGameState('end-game')}
                        className='bg-slate-500 text-slate-50 rounded-4xl py-2'>End Game</button> */}
                    <RestartButton setGameState={props.setGameState}/>
                    <StartNewGameButton initialize={props.initialize}/>
                </div>
            </div>
        </header>
    )
}

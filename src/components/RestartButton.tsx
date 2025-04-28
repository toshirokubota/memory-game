import React from 'react'
import { GameState } from '../App'

type Props = {
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    more_styles?: string | undefined,
}

export default function RestartButton(props: Props): React.JSX.Element {
    let classStr:string = 'px-2 py-0.5 text-slate-100 bg-orange-400\
                hover:bg-orange-300 focus:bg-orange-300 \
                hover:cursor-pointer focus:cursor-pointer\
                rounded-4xl';
    if(props.more_styles) classStr += ' ' + props.more_styles;
    return (
        <button className={classStr}
            onClick={()=> {props.setGameState('start-game')}}>
                Restart
        </button>
    )
}

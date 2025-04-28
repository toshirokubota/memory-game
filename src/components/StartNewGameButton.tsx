import React from 'react'

type Props = {
    initialize: React.Dispatch<React.SetStateAction<boolean>>
    more_styles?: string | undefined,
};

export default function StartNewGameButton(props: Props): React.JSX.Element {
    let classStr:string = 'bg-slate-300 text-slate-800 hover:bg-sky-700 focus:bg-sky-700\
            hover:text-slate-100 focus:text-slate-100\
            hover:cursor-pointer focus:cursor-pointer\
            px-2 py-0.5 font-bold rounded-4xl' ;
    if(props.more_styles) classStr += ' ' + props.more_styles;
    return (
        <button className={classStr}
            onClick={()=>props.initialize(true)}>
                New Game
        </button>
    )
}

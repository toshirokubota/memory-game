import React from 'react'

type Props = {
    initialize: React.Dispatch<React.SetStateAction<boolean>>
    more_styles?: string | undefined,
};

export default function StartNewGameButton(props: Props): React.JSX.Element {
    let classStr:string = 'px-2 py-0.5 mx-1 bg-slate-500 rounded-4xl' ;
    if(props.more_styles) classStr += ' ' + props.more_styles;
    return (
        <button className={classStr}
            onClick={()=>props.initialize(true)}>
                New Game
        </button>
    )
}

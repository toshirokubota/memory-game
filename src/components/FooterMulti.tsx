
import React from 'react'; 
import {NumPlayers} from '../App';

type ChildProps = {
    num_players: NumPlayers,
    scores: number[],
    player: number,
};

export default function FooterMulti(props: ChildProps) {

    function ScoreBoxes(num_players: NumPlayers): React.JSX.Element[] {
        const boxes: React.JSX.Element[] = [];
        for(let i=0; i<num_players; ++i) {
            const classStr: string = 'score-box flex px-1 py-0.5 rounded-xl text-center ' + 
                `${i == props.player ? 'current bg-orange-500 text-white': 'bg-slate-300'} `
            boxes.push(
                <div key={i} className='flex flex-col'>
                    <p className={classStr}>
                        <span className='score-box-player text-base'>{i + 1}</span>
                        <span className={'score-box-score text-2xl'}>{props.scores[i]}</span>
                    </p>
                    <span className={'text-center text-xs text-slate-900 score-box-note ' + `${i == props.player ? 'current': ''}`}>
                        CURRENT PLAYER
                    </span>
                </div>
            )
        }
        return boxes;
    }

    const classStr: string = `m-4 grid grid-cols-${props.num_players} gap-4`;
    return (
        <footer className={classStr}>
            {ScoreBoxes(props.num_players)}
        </footer>
    )
}
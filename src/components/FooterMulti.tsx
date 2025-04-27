
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
            const classStr: string = 'flex flex-col px-1 py-0.5 mx-1 rounded-xl text-center ' + 
                `${i == props.player ? 'bg-orange-500 text-white': 'bg-slate-500 text-slate-800'} `
            boxes.push(
                <span key={i} className={classStr}>
                    <span>P{i + 1}</span>
                    <span>{props.scores[i]}</span>
                </span>
            )
        }
        return boxes;
    }

    const classStr: string = `m-4 grid gap-4 grid-cols-${props.num_players}`;
    return (
        <footer className={classStr}>
            {ScoreBoxes(props.num_players)}
        </footer>
    )
}
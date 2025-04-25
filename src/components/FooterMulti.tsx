
import React from 'react'; 
import {NumPlayers} from '../App';

type ChildProps = {
    num_players: NumPlayers;
};

export default function FooterMulti(props: ChildProps) {

    function ScoreBoxes(num_players: NumPlayers): React.JSX.Element[] {
        const boxes: React.JSX.Element[] = [];
        for(let i=1; i<=num_players; ++i) {
            boxes.push(
                <span key={i} className='px-1 py-0.5 mx-1'>{i}</span>
            )
        }
        return boxes;
    }

    return (
        <footer className='flex items-center'>
            {ScoreBoxes(props.num_players)}
        </footer>
    )
}
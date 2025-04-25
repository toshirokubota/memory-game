import React from 'react';
import {useState, useEffect, createContext, useContext } from 'react';
import { GameOption } from "../App";
import Header from './Header'
import FooterSolo from './FooterSolo';
import FooterMulti from './FooterMulti';

// export type MoveState = 'first' | 'second' | 'end';
// export type GameStateType = {
//     move: MoveState,
//     prev_tile: React.JSX.Element | null; //previously clicked tile
//     tiles: React.JSX.Element[]
// }
export const ClickedTileKeys = createContext<number[]>([]);

type GameBoardProps = {
    option: GameOption;

};
type TileState = 'closed' | 'opened' | 'matched';
type TileProps = {
    value: string, index: number
}

function randomizeObjects<T>(array: T[]): T[]  {
    const shuffled = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };
  
const tilesContext:object[] = [];

function Tile(props: TileProps): React.JSX.Element {
    const [tileState, setTileState]=useState<TileState>('closed');
    const clickedTileKeys = useContext<number[]>(ClickedTileKeys);
    tilesContext.push({value: props.value, setTileState});
    
    const flipTile = () => {
        if(tileState === 'matched' || tileState === 'opened') return; //do nothing
        else {
            setTileState('opened');
            clickedTileKeys.push(props.index);
            console.log('Tile: flipTile(): ', clickedTileKeys);
        }
    }
    
    function tileFace(): string {
        if(tileState === 'matched' || tileState == 'opened') return props.value;
        else if(tileState === 'closed') return ' ';
        else return ' '; //this should not happen
    }

    return (
        <button 
            className={`tile ${tileState} w-8 h-8 rounded-full m-2 text-gray-100`} 
            onClick={flipTile}>
                {tileFace()}
        </button>
    )
}

function GameBoard(props: GameBoardProps): React.JSX.Element {
    const tiles: React.JSX.Element[] = [];
    const nrows = props.option.grid_size;
    let values: number[] = [];
    for(let i=0; i<nrows * nrows / 2; ++i) {
        values.push(i+1);
        values.push(i+1);
    }
    values = randomizeObjects(values);
    for(let i=0; i<values.length; ++i) {
        tiles.push(<Tile value={values[i].toString()} key={i} index={i}></Tile>);
    }

    return (
        <div className={`game-board ${nrows==4 ? 'grid-cols-4 grid-rows-4': 'grid-cols-6 grid-rows-6'}`}>
            {tiles}
        </div>
    )
}

export default function MemoryGame(props: GameBoardProps) {
    const np = props.option.num_players;
    //let currentPlayer: number = 0;
    const clickedTileKeys: number[] = []; 

    useEffect(() => {
        console.log('inside MemoryGame:: useEffect()');

        if(clickedTileKeys.length == 2) {
            let k1 = clickedTileKeys[0];
            let k2 = clickedTileKeys[1];
            if(tilesContext[k1].value === tilesContext[k2].value ) {
                tilesContext[k1].setTileState('matched');
                tilesContext[k2].setTilesState('matched');
            } else {
                tilesContext[k1].setTileState('closed');
                tilesContext[k2].setTilesState('closed');
            }
            clickedTileKeys.length = 0;
        }
    }, [clickedTileKeys])

    return (
        <div>
            <ClickedTileKeys.Provider value={clickedTileKeys}>
                <Header />
                <GameBoard option={props.option}>
                </GameBoard>
                {np === 1 && <FooterSolo />}
                {np !== 1 && <FooterMulti num_players={props.option.num_players}/>}
            </ClickedTileKeys.Provider>
        </div>
    )
}
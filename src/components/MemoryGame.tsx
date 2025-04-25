import React from 'react';
import {useState, createContext } from 'react';
import { GameOption } from "../App";
import Header from './Header'
import FooterSolo from './FooterSolo';
import FooterMulti from './FooterMulti';

export type MoveState = 'first' | 'second' | 'end';
export type GameStateType = {
    move: MoveState,
    //for multi-player game
    scores: number[],
    //for single player game
    time: number,
    num_moves: number
}
export const GameContext = createContext<GameStateType | null>(null);

type ChildProps = {
    option: GameOption;
};
type TileState = 'closed' | 'opened' | 'matched';


function randomizeObjects<T>(array: T[]): T[]  {
    const shuffled = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };
  

function Tile({value}): React.JSX.Element {
    const [tileState, setTileState]=useState<TileState>('closed');
    const flipTile = () => {
        if(tileState === 'matched') return; //do nothing
        else if(tileState === 'closed') {
            setTileState('opened');
        } else {
            setTileState('closed');
        }
    }
    
    function tileFace(): string {
        if(tileState === 'matched' || tileState == 'opened') return value;
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

function GameBoard(props: ChildProps): React.JSX.Element {
    const tiles: React.JSX.Element[] = [];
    const nrows = props.option.grid_size;
    for(let i=0; i<nrows * nrows / 2; ++i) {
        tiles.push(<Tile value={i+1} key={2 * i}></Tile>);
        tiles.push(<Tile value={i+1} key={2 * i + 1} ></Tile>);
    }
    const sortedTiles: React.JSX.Element[] = randomizeObjects(tiles);

    return (
        <div className={`grid ${nrows==4 ? 'grid-cols-4 grid-rows-4': 'grid-cols-6 grid-rows-6'} gap-1`}>
            {sortedTiles}
        </div>
    )
}

export default function MemoryGame(props: ChildProps) {
    const np = props.option.num_players;
    const state: GameStateType = {
        move: 'end', scores: new Array(np).fill(0),
        time: 0, num_moves: 0
    };
    return (
        <div>
            <GameContext.Provider value={state}>
                <Header />
                <GameBoard option={props.option}>
                </GameBoard>
                {np === 1 && <FooterSolo />}
                {np !== 1 && <FooterMulti num_players={props.option.num_players}/>}
            </GameContext.Provider>
        </div>
    )
}
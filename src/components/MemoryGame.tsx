import React from 'react';
import {useState, useEffect, useRef } from 'react';
import { GameOption} from "../App";
import Header from './Header'
import FooterSolo from './FooterSolo';
import FooterMulti from './FooterMulti';

type GameBoardProps = {
    option: GameOption;

};

type GameState = 'start-game' | 'playing' | 'end-turn' | 'end-game';
type TileState = 'closed' | 'opened' | 'mismatch' | 'matched';
type TileProps = {
    value: string, 
    index: number,
    tileStates: TileState[],
    gameState: GameState,
    setTileState: React.Dispatch<React.SetStateAction<TileState[]>>
    setClickedIndices: React.Dispatch<React.SetStateAction<number[]>>
}

function randomizeObjects<T>(array: T[]): T[]  {
    const shuffled = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };  

export default function MemoryGame(props: GameBoardProps) {
    const np = Number(props.option.num_players);
    const grid_size = props.option.grid_size;
    const ntiles: number = grid_size * grid_size;
    const [gameState, setGameState] = useState<GameState>('start-game');
    const [clickedTileIndices, setClickedTileIndices] = useState<number[]>([]); 
    const [tileStates, setTileStates] = useState(new Array(ntiles).fill('closed'));
    const values = useRef<string[]>(createTileValues(grid_size, null));
    //const [idleState, setIdleState] = useState<boolean>(false); //true if it is an end of a turn. click anywhere and tiles will flip back

    useEffect(() => {
        if(gameState === 'playing') {
            if(clickedTileIndices.length >= 2) {
                let k1 = clickedTileIndices[0];
                let k2 = clickedTileIndices[1];
                console.log('inside MemoryGame:: useEffect()', tileStates[k1], tileStates[k2]);
                if(tileStates[k1] == 'opened' && tileStates[k2] == 'opened'){
                    if(values.current[k1] === values.current[k2] ) {
                        let newStates = [...tileStates];
                        newStates[k1] = 'matched';
                        newStates[k2] = 'matched';
                        setTileStates(newStates);
                        setClickedTileIndices([]);
                    } else {
                        let newStates = [...tileStates];
                        newStates[k1] = 'mismatch';
                        newStates[k2] = 'mismatch';
                        setTileStates(newStates);
                        //setIdleState(true);
                        updateGameState(gameState); //end of the turn
                    }
                }
                else if(tileStates[k1] == 'mismatch' && tileStates[k2] == 'mismatch'){
                    let newStates = [...tileStates];
                    newStates[k1] = 'closed';
                    newStates[k2] = 'closed';
                    setTileStates(newStates);
                    setClickedTileIndices([]);
                }
            }
        }
    }, [tileStates, clickedTileIndices, gameState])

    function updateGameState(gameState: GameState) {
        console.log('enter updateGameState:: ', gameState);
        if(gameState === 'start-game') setGameState('playing');
        else if(gameState === 'playing') setGameState('end-turn');
        else if(gameState === 'end-turn') setGameState('playing');
        else if(gameState === 'end-game') setGameState('start-game');
    }

    function Tile(props: TileProps): React.JSX.Element {
        const tileStates: TileState[] = props.tileStates;  
        const index = props.index;    
        const tileState: TileState = tileStates[index]; 
        const gameState: GameState = props.gameState; 
        const flipTile = () => {
            if(gameState !== 'playing') return;

            if(tileState === 'matched' || tileState === 'opened') return; //do nothing
            else {
                const newStates = [...tileStates];
                newStates[index] = 'opened';
                props.setTileState(newStates);
                props.setClickedIndices(prev => [...prev, index]);
            }
        }
        
        function tileFace(): string {
            return props.value;
            // if(states[index] === 'matched' || states[index] == 'opened') return props.value;
            // else if(states[index] === 'closed') return ' ';
            // else return ' '; //this should not happen
        }
    
        return (
            <button 
                className={`tile ${tileStates[index]} w-8 h-8 rounded-full m-2 text-gray-100`} 
                onClick={flipTile}>
                    <span>{tileFace()}</span>
            </button>
        )
    }

    function createTileValues(grid_size: number, lexicon: string[] | null): string[] {
        let values: string[] = [];
        const n = grid_size * grid_size / 2;
        for(let i=0; i< n; ++i) {
            if(lexicon && lexicon.length >= n) {
                values.push(lexicon[i]);
                values.push(lexicon[i]);
            } else {
                values.push((i+1).toString());
                values.push((i+1).toString());    
            }
        }
        return randomizeObjects(values);
    }
    
    const tiles: React.JSX.Element[] = [];
    for(let i=0; i<values.current.length; ++i) {
        tiles.push(
        <Tile
            value={values.current[i]} 
            index={i}
            tileStates={tileStates}
            gameState={gameState}
            setTileState={setTileStates}
            setClickedIndices={setClickedTileIndices}
        />);
    }

    function GameControlingModal(gameState: GameState): React.JSX.Element | null {
        //const [visible, setVisible] = useState(true);

        function gameControlingMessage(gameState: GameState): string {
            if(gameState === 'start-game') {
                return 'click to start the game';
            } else if(gameState === 'end-turn') {
                return 'Mismatch. click to continue.'
            } else if(gameState === 'end-game') {
                return 'Game End';
            } else {
                return 'Cannot happen here';
            }
        }
        
        return (
            gameState != 'playing' ?
            <div className={`gameModal ${gameState}`} onClick={()=>{updateGameState(gameState);}}>
                <span>{gameControlingMessage(gameState)}</span>
            </div> : null
        );
    }

    return (
        <div>
            <Header />
            <div 
                // onClick={()=>{
                //     console.log('clicked', idleState);
                //     setIdleState(false);
                // }}
                className={`game-board ${grid_size==4 ? 'grid-cols-4 grid-rows-4': 'grid-cols-6 grid-rows-6'}`}>
                {tiles}
            </div>
            {np === 1 && <FooterSolo />}
            {np !== 1 && <FooterMulti num_players={props.option.num_players}/>}
            {GameControlingModal(gameState)}
        </div>
    )
}
import React from 'react';
import {useState, useEffect, useRef } from 'react';
import { GameOption, GameTheme } from "../App";
//import Header from './Header'
import FooterSolo from './FooterSolo';
import FooterMulti from './FooterMulti';
import Tile from './Tile'

const faIcons: string[] = ['moon', 'sun', 'fire', 'cloud', 'bell', 'car', 'frog', 'fish', 'paw', 
    'motorcycle', 'anchor', 'house', 'phone', 'futbol', 'heart', 'keyboard', 'map', 'compass'];

type GameBoardProps = {
    option: GameOption;
    initialize: React.Dispatch<React.SetStateAction<boolean>>
};

export type GameState = 'start-game' | 'playing' | 'matched' | 'mismatched' | 'end-game';

function randomizeObjects<T>(array: T[]): T[] {
    const shuffled = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
}  
  
function createTileValues(
    grid_size: number,
    theme: GameTheme
  ): string[] {
    let values: string[] = [];
    const n = (grid_size * grid_size) / 2;
    if(theme === 'icons') {
        for (let i = 0; i < n; ++i) {
            values.push(faIcons[i]);
            values.push(faIcons[i]);
        }
    } else {
        for (let i = 0; i < n; ++i) {
            values.push((i + 1).toString());
            values.push((i + 1).toString());
        }
    }
    return randomizeObjects(values);
}
  
export default function MemoryGame(props: GameBoardProps) {
    const num_players = Number(props.option.num_players);
    const grid_size = props.option.grid_size;
    const ntiles: number = grid_size * grid_size;
    const [gameState, setGameState] = useState<GameState>('start-game');
    const [clickedTileIndices, setClickedTileIndices] = useState<number[]>([]); 
    const [tileStates, setTileStates] = useState(new Array(ntiles).fill('closed'));
    const values = useRef<string[]>(createTileValues(grid_size, props.option.theme));
    const [numMatches, setNumMatches] = useState<number>(0);
    const [numMoves, setNumMoves] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const startTimeRef = useRef(0); // Store without re-renders
    const intervalId = useRef(0);
    const [scores, setScores] = useState<number[]>(new Array(num_players).fill(0));
    const [currentPlayer, setCurrentPlayer] = useState(0);
  
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
                        setNumMatches(prev => prev + 1);
                        updateGameState(gameState, true); //end of the turn
                        setScores(prev => {
                            let newscores = [...prev];
                            newscores[currentPlayer]++;
                            return newscores;
                        });
                    } else {
                        let newStates = [...tileStates];
                        newStates[k1] = 'mismatched';
                        newStates[k2] = 'mismatched';
                        setTileStates(newStates);
                        updateGameState(gameState, false); //end of the turn
                        setCurrentPlayer(prev => (prev + 1) % num_players);
                    }
                    setNumMoves(prev => prev + 1);
                }
                else {//if(tileStates[k1] == 'mismatch' && tileStates[k2] == 'mismatch'){
                    let newStates = [...tileStates];
                    newStates[k1] = tileStates[k1] === 'matched' ?   'opened': 'closed';
                    newStates[k2] = tileStates[k1] === 'matched' ? 'opened': 'closed';
                    setTileStates(newStates);
                    setClickedTileIndices([]);
                }
            }
        }
    }, [tileStates, clickedTileIndices, gameState])

    useEffect(()=>{ //check for the end of the game
        if(numMatches >= grid_size * grid_size / 2 && gameState === 'playing') setGameState('end-game');
    }, [numMatches, gameState]);

    useEffect(() => {
        if(gameState === 'start-game') { //restarting the game
            setTileStates(prev => prev.fill('closed'));
            setNumMatches(0);
        } else if (gameState === 'end-game') {
            clearInterval(intervalId.current);
            intervalId.current = 0;
        }
    }, [gameState]);

    //Timer clean up
    useEffect(() => {    
        return () => {
            if(intervalId.current !== 0) {
                clearInterval(intervalId.current);
            }
        }
      }, []);

    
    function updateGameState(gameState: GameState, matched: boolean | undefined) {
        console.log('enter updateGameState:: ', gameState);
        if(gameState === 'start-game') {
            setGameState('playing');
            //actual begging of the playing. Start the timer now!
            startTimeRef.current = Date.now();
            //start the timer
            intervalId.current = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
            setScores(new Array(num_players).fill(0));
            setCurrentPlayer(0);
            setNumMoves(0);
        }
        else if(gameState === 'playing' && matched) setGameState('matched');
        else if(gameState === 'playing' && !matched) setGameState('mismatched');
        else if(gameState === 'matched' || gameState === 'mismatched') setGameState('playing');
        else if(gameState === 'end-game') setGameState('start-game');
    }

    
    const tiles: React.JSX.Element[] = [];
    for(let i=0; i<values.current.length; ++i) {
        tiles.push(
        <Tile
            value={values.current[i]} 
            index={i}
            type={props.option.theme}
            tileStates={tileStates}
            gameState={gameState}
            setTileState={setTileStates}
            setClickedIndices={setClickedTileIndices}
        />);
    }

    function RestartButton(): React.JSX.Element {
        return (
            <button className='px-2 py-0.5 mx-1' onClick={()=> {setGameState('start-game')}}>Restart</button>
        )
    }
    function StartNewGameButton(): React.JSX.Element {
        return (
            <button className='px-2 py-0.5 mx-1' onClick={()=>props.initialize(true)}>New Game</button>    
        )
    }

    function GameControlingModal(gameState: GameState): React.JSX.Element | null {
        //const [visible, setVisible] = useState(true);
        function EndGameModalSolo() {
            return (
                <div>
                    <h1>You did it!</h1>
                    <p>Game over! Here's how you got on...</p>
                    <p><span>Time Elapsed: </span><span>{elapsedTime}</span></p>
                    <p><span>Moves Taken: </span><span>{numMoves} Moves</span></p>
                    <div>
                        <RestartButton />
                        <StartNewGameButton />
                    </div>
                </div>
            )
        }
        function EndGameModalMulti() {
            const sortedScores = scores.map((value, index)=>({value, index}))
                    .sort((a,b) => b.value - a.value); //reverse sort
            const bestScore = sortedScores[0].value;
            return (
                <div>
                    <h1>{ 
                        sortedScores[0].value > sortedScores[1].value ? 
                        `Player ${sortedScores[0].index + 1} wins` :
                        "It's a tie!"}
                    </h1>
                    <p>Game over! Here are the results...</p>
                    {
                        sortedScores.map(score => (
                            <p>Player {score.index + 1} {score.value == bestScore ? '(Winner!)': ''}
                            {score.value} Pairs</p>
                        ))
                    }
                    <div>
                        <RestartButton />
                        <StartNewGameButton />
                    </div>
                </div>
            )
        }

        // function gameControlingMessage(gameState: GameState): string {
        //     if(gameState === 'start-game') {
        //         return 'click to start the game';
        //     } else if(gameState === 'mismatched') {
        //         return `Mismatch. Player #${currentPlayer + 1} goes next. Click to continue.`
        //     } else if(gameState === 'matched'){
        //         return `Matched! Player #${currentPlayer + 1} stays on. click to continue.`
        //     } else if(gameState === 'end-game') {
        //         return 'Game End';
        //     } else {
        //         return 'Cannot happen here';
        //     }
        // }
        
        return (
            gameState != 'playing' ?
            <div className={`gameModal ${gameState}`} onClick={()=>{updateGameState(gameState, undefined);}}>
                {
                    gameState === 'end-game' && num_players === 1 ? <EndGameModalSolo /> :
                    gameState === 'end-game' && num_players > 1 ? <EndGameModalMulti />: null
                    // <span>{gameControlingMessage(gameState)}</span>
                }
            </div> : null
        );
    }

    function Header() {
        return (
            <header className='flex justify-between'>
                <h1>Memory</h1>
                <div>
                    <button className='px-2 py-0.5 mx-1' onClick={()=> {setGameState('start-game')}}>Restart</button>
                    <button className='px-2 py-0.5 mx-1' onClick={()=>props.initialize(true)}>New Game</button>
                </div>
            </header>
        )
    }

    return (
        <div>
            <Header />
            <div 
                className={`game-board ${grid_size==4 ? 'grid-cols-4 grid-rows-4': 'grid-cols-6 grid-rows-6'}`}>
                {tiles}
            </div>
            {num_players === 1 && <FooterSolo moves={numMoves} elapsedTime={elapsedTime}/>}
            {num_players !== 1 && <FooterMulti num_players={props.option.num_players} scores={scores} player={currentPlayer}/>}
            {GameControlingModal(gameState)}
        </div>
    )
}
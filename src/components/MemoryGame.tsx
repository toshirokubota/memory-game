import React from 'react';
import {useState, useEffect, useRef } from 'react';
import { GameOption, GameTheme, GameState } from "../App";
import Header from './Header'
import FooterSolo from './FooterSolo';
import FooterMulti from './FooterMulti';
import Tile from './Tile'
import RestartButton from './RestartButton';
import StartNewGameButton from './StartNewGameButton';
import { formatTime } from './FooterSolo';

const faIcons: string[] = ['moon', 'sun', 'fire', 'cloud', 'bell', 'car', 'frog', 'fish', 'paw', 
    'motorcycle', 'anchor', 'house', 'phone', 'futbol', 'heart', 'keyboard', 'map', 'compass'];

type GameBoardProps = {
    option: GameOption;
    initialize: React.Dispatch<React.SetStateAction<boolean>>
};

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
            key={i}
            value={values.current[i]} 
            index={i}
            type={props.option.theme}
            tileStates={tileStates}
            gameState={gameState}
            setTileState={setTileStates}
            setClickedIndices={setClickedTileIndices}
        />);
    }

    function EndGameModalSolo() {
        return (
            <div className='overlay'>
                <div className='flex flex-col items-center p-4 mx-6 my-24 rounded-xl bg-slate-100'>
                    <h1 className='mt-4 text-2xl text-slate-900 font-bold'>You did it!</h1>
                    <p className='text-sm mb-4 text-slate-500 font-bold'>Game over! Here's how you got on...</p>
                    <p className={'w-full flex justify-between mb-1 p-4 rounded-xl bg-slate-400 text-slate-900'}>
                        <span>Time Elapsed:</span>
                        <span>{formatTime(elapsedTime)}</span>
                    </p>
                    <p className={'w-full flex justify-between mb-4 p-4 rounded-xl bg-slate-400 text-slate-900'}>
                        <span>Moves Taken:</span>
                        <span>{numMoves} Moves</span>
                    </p>
                    <div className='grid gap-4 w-full m-4'>
                        <RestartButton setGameState={setGameState} more_styles='py-4 text-lg font-bold'/>
                        <StartNewGameButton initialize={props.initialize} more_styles='py-4 text-lg font-bold'/>
                    </div>
                </div>
            </div>
        )
    }
    function EndGameModalMulti() {
        const sortedScores = scores.map((value, index)=>({value, index}))
                .sort((a,b) => b.value - a.value); //reverse sort
        const bestScore = sortedScores[0].value;
        return (
            <div className='overlay'>
            <div className='flex flex-col items-center p-4 bg-slate-100'>
                <h1 className='text-2xl text-slate-900 font-bold'>{ 
                    sortedScores[0].value > sortedScores[1].value ? 
                    `Player ${sortedScores[0].index + 1} wins` :
                    "It's a tie!"}
                </h1>
                <p className='text-sm text-slate-500 font-bold'>Game over! Here are the results...</p>
                {
                    sortedScores.map((score, index) => (
                        <div key={index}
                            className={'w-full flex justify-between mx-8 my-2 p-4 rounded-md ' + 
                            `${score.value == bestScore ? 'bg-slate-900 text-slate-100': 'bg-slate-400 text-slate-900'}`}
                        >
                          <span>Player {score.index + 1} {score.value == bestScore ? '(Winner!)': ''}</span>   
                        <span>{score.value} Pairs</span></div>
                    ))
                }
                <div className='grid gap-4 w-full m-4'>
                    <RestartButton setGameState={setGameState} more_styles='py-4 text-lg font-bold'/> 
                    <StartNewGameButton initialize={props.initialize} more_styles='py-4 text-lg font-bold'/>
                </div>
            </div>
            </div>
        )
    }


    return (
        <div>
            <Header setGameState={setGameState} initialize={props.initialize}/>
            <div 
                className={`game-board ${grid_size==4 ? 'grid-cols-4 grid-rows-4 text-4xl': 'grid-cols-6 grid-rows-6 text-2xl'}`}
                onClick={()=>{
                    if(gameState !== 'playing') updateGameState(gameState, undefined)
                }}>
                {tiles}
            </div>
            {num_players === 1 && <FooterSolo moves={numMoves} elapsedTime={elapsedTime}/>}
            {num_players !== 1 && <FooterMulti num_players={props.option.num_players} scores={scores} player={currentPlayer}/>}
            {num_players === 1 && gameState === 'end-game' && <EndGameModalSolo />}
            {num_players !== 1 && gameState === 'end-game' && <EndGameModalMulti />}
        </div>
    )
}
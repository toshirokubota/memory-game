import React from 'react';
import {useState, useEffect, useRef } from 'react';
import { GameOption, GameTheme, GameState } from "../App";
import Header from './Header'
import FooterSolo from './FooterSolo';
import FooterMulti from './FooterMulti';
import Tile from './Tile'
import { EndGameCardSolo, EndGameCardMulti } from './EndGameCards';
import { randomizeObjects } from '../libs';

const faIcons: string[] = ['moon', 'sun', 'fire', 'cloud', 'bell', 'car', 'frog', 'fish', 'paw', 
    'motorcycle', 'anchor', 'house', 'phone', 'futbol', 'heart', 'keyboard', 'map', 'compass'];

type GameBoardProps = {
    option: GameOption;
    initialize: React.Dispatch<React.SetStateAction<boolean>>
};

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
  
export default function MemoryGame(props: GameBoardProps) : React.JSX.Element {
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
                    }
                    setNumMoves(prev => prev + 1);
                }
                else if(tileStates[k1] == 'matched' && tileStates[k2] == 'matched'){
                    let newStates = [...tileStates];
                    newStates[k1] = 'opened';
                    newStates[k2] = 'opened';
                    setTileStates(newStates);
                    setClickedTileIndices([]);
                }
                else if(tileStates[k1] == 'mismatched' && tileStates[k2] == 'mismatched'){
                    let newStates = [...tileStates];
                    newStates[k1] = 'closed';
                    newStates[k2] = 'closed';
                    setTileStates(newStates);
                    setClickedTileIndices([]);
                    setCurrentPlayer(prev => (prev + 1) % num_players); //change the player
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

    
    function updateGameState(gameState: GameState, matched?: boolean) {
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

    function StartMessage() : React.JSX.Element {
        return (
            <div className='overlay' onClick={()=>{updateGameState(gameState)}}>
                <div className={'my-16 mx-auto'}>
                    <p className='text-3xl text-slate-100 font-bold text-center'>Click to start the game</p>
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
                    if(gameState !== 'playing') updateGameState(gameState)
                }}>
                {tiles}
            </div>
            {gameState === 'start-game' && <StartMessage />}
            {num_players === 1 && <FooterSolo moves={numMoves} elapsedTime={elapsedTime}/>}
            {num_players !== 1 && <FooterMulti num_players={props.option.num_players} scores={scores} player={currentPlayer}/>}
            {num_players === 1 && gameState === 'end-game' && 
                <EndGameCardSolo numMoves={numMoves} elapsedTime={elapsedTime} setGameState={setGameState} initialize={props.initialize}/>}
            {num_players !== 1 && gameState === 'end-game' && 
                <EndGameCardMulti scores={scores} setGameState={setGameState} initialize={props.initialize}/>}
        </div>
    )
}
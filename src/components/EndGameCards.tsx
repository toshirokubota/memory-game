import React from "react";
import RestartButton from './RestartButton'
import StartNewGameButton from "./StartNewGameButton";
import { formatTime } from "../libs";
import { GameState } from "../App";

type PropsSolo = {
    numMoves: number,
    elapsedTime: number,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    initialize: React.Dispatch<React.SetStateAction<boolean>>
}

export function EndGameCardSolo(props: PropsSolo) {
    return (
        <div className='overlay'>
            <div className='end-card flex flex-col items-center p-4 mx-6 my-24 rounded-xl bg-slate-100'>
                <h1 className='mt-4 text-2xl text-slate-900 font-bold'>You did it!</h1>
                <p className='text-sm mb-4 text-slate-500 font-bold'>Game over! Here's how you got on...</p>
                <p className={'w-full flex justify-between mb-1 p-4 rounded-xl bg-slate-400 text-slate-900'}>
                    <span>Time Elapsed:</span>
                    <span>{formatTime(props.elapsedTime)}</span>
                </p>
                <p className={'w-full flex justify-between mb-4 p-4 rounded-xl bg-slate-400 text-slate-900'}>
                    <span>Moves Taken:</span>
                    <span>{props.numMoves} Moves</span>
                </p>
                <div className='end-card-buttons flex w-full gap-4 m-4'>
                    <RestartButton setGameState={props.setGameState} more_styles='py-4 text-lg font-bold'/>
                    <StartNewGameButton initialize={props.initialize} more_styles='py-4 text-lg font-bold'/>
                </div>
            </div>
        </div>
    )
}

type PropsMulti = {
    scores: number[],
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    initialize: React.Dispatch<React.SetStateAction<boolean>>
}

export function EndGameCardMulti(props: PropsMulti) {
    const scores = props.scores;
    const sortedScores = scores.map((value, index)=>({value, index}))
            .sort((a,b) => b.value - a.value); //reverse sort
    const bestScore = sortedScores[0].value;
    return (
        <div className='overlay'>
            <div className='end-card flex flex-col items-center p-4 mx-6 my-24 rounded-xl bg-slate-100'>
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
                <div className='end-card-buttons flex w-full gap-4 m-4'>
                    <RestartButton setGameState={props.setGameState} more_styles='py-4 text-lg font-bold'/> 
                    <StartNewGameButton initialize={props.initialize} more_styles='py-4 text-lg font-bold'/>
                </div>
            </div>
        </div>
    )
}


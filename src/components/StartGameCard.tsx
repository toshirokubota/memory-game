import React from "react";
import { GameOption } from '../App';

type ChildProps = {
    initialize: React.Dispatch<React.SetStateAction<boolean>>,
    setOption: React.Dispatch<React.SetStateAction<GameOption>>;
};


export default function StartGameCard(props: ChildProps) {
    function handleSubmit(formData: any) : void {
        console.log(formData);
        const theme = formData.get('theme-choice');
        const num_players = formData.get('num-players-choice');
        const grid_size = formData.get('grid-size-choice') === '4x4' ? 4: 6;
        props.initialize(false); //initialization done
        props.setOption({theme, num_players, grid_size});
    }
    return (
        <div className='start-game-card'>
            <h1 className='text-center text-slate-100 text-3xl'>memory</h1>
            <form action={handleSubmit} 
                className='p-4 m-4 bg-gray-100 flex flex-col items-start rounded-md'>
                <h3 className='font-bold text-sm text-slate-500 my-2'>Select Theme</h3>
                <div className='grid w-full grid-cols-2 gap-2 mb-4'>
                    <input type="radio" name="theme-choice" value="numbers" id="theme-numbers"/>
                    <label htmlFor="theme-numbers">
                        Numbers
                    </label>
                    <input type="radio" name="theme-choice" value="icons" id="theme-icons"/>
                    <label htmlFor="theme-icons">
                        Icons
                    </label>
                </div>
                <h3 className='font-bold text-sm text-slate-500 my-2'>Number of Players</h3>
                <div className='grid w-full grid-cols-4 gap-2 mb-4'>
                    <input type="radio" name="num-players-choice" value="1" id="one-player"/>
                    <label htmlFor="one-player">
                        1
                    </label>
                    <input type="radio" name="num-players-choice" value="2" id="two-players"/>
                    <label htmlFor="two-players">
                        2
                    </label>
                    <input type="radio" name="num-players-choice" value="3" id="three-players"/>
                    <label htmlFor="three-players">
                        3
                    </label>
                    <input type="radio" name="num-players-choice" value="4" id="four-players"/>
                    <label htmlFor="four-players">
                        4
                    </label>
                </div>
                <h3 className='font-bold text-sm text-slate-500 my-2'>Grid Size</h3>
                <div className='grid w-full grid-cols-2 gap-2 mb-4'>
                    <input type="radio" name="grid-size-choice" value="4x4" id="grid-size-4x4"/>
                    <label htmlFor="grid-size-4x4">
                        4x4
                    </label>
                    <input type="radio" name="grid-size-choice" value="6x6" id="grid-size-6x6"/>
                    <label htmlFor="grid-size-6x6">
                        6x6
                    </label>
                </div>
                <button className='px-4 py-2 my-4 w-full bg-orange-400 rounded-4xl'>Start Game</button>
            </form>
        </div>
    )
}
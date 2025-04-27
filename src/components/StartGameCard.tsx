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
        <div>
            <h1>memory</h1>
            <form action={handleSubmit}>
                <h3>select Theme</h3>
                <div>
                    <label htmlFor="theme-numbers">
                        <input type="radio" name="theme-choice" value="numbers" id="theme-numbers"/>
                        Numbers
                    </label>
                    <label htmlFor="theme-icons">
                        <input type="radio" name="theme-choice" value="icons" id="theme-icons"/>
                        Icons
                    </label>
                </div>
                <h3>Number of Players</h3>
                <div>
                    <label htmlFor="one-player">
                        <input type="radio" name="num-players-choice" value="1" id="one-player"/>
                        1
                    </label>
                    <label htmlFor="two-players">
                        <input type="radio" name="num-players-choice" value="2" id="two-players"/>
                        2
                    </label>
                    <label htmlFor="three-players">
                        <input type="radio" name="num-players-choice" value="3" id="three-players"/>
                        3
                    </label>
                    <label htmlFor="four-players">
                        <input type="radio" name="num-players-choice" value="4" id="four-players"/>
                        4
                    </label>
                </div>
                <h3>Grid Size</h3>
                <div>
                    <label htmlFor="grid-size-4x4">
                        <input type="radio" name="grid-size-choice" value="4x4" id="grid-size-4x4"/>
                        4x4
                    </label>
                    <label htmlFor="grid-size-6x6">
                        <input type="radio" name="grid-size-choice" value="6x6" id="grid-size-6x6"/>
                        6x6
                    </label>
                </div>
                <button>Start Game</button>
            </form>
        </div>
    )
}
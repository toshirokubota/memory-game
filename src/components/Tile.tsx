import React from 'react';
//import {useState, useEffect, useRef } from 'react';
import { GameState} from "./MemoryGame";
import { GameTheme } from '../App'

export type TileState = "closed" | "opened" | "mismatched" | "matched";
export type TileProps = {
  value: string,
  type: GameTheme,
  index: number,
  tileStates: TileState[],
  gameState: GameState,
  setTileState: React.Dispatch<React.SetStateAction<TileState[]>>,
  setClickedIndices: React.Dispatch<React.SetStateAction<number[]>>,
};

export default function Tile(props: TileProps): React.JSX.Element {
  const tileStates: TileState[] = props.tileStates;
  const index = props.index;
  const tileState: TileState = tileStates[index];
  const gameState: GameState = props.gameState;
  const flipTile = () => {
    if (gameState !== "playing") return;

    if (tileState === "matched" || tileState === "opened") return; //do nothing
    else {
      const newStates = [...tileStates];
      newStates[index] = "opened";
      props.setTileState(newStates);
      props.setClickedIndices((prev) => [...prev, index]);
    }
  };

  return (
    <button
      className={`tile ${tileStates[index]} w-8 h-8 rounded-full m-2 text-gray-100`}
      onClick={flipTile}
    >
      { props.type == 'numbers' ? <span>{props.value}</span>: <i className={`fa fa-${props.value}`}></i> }
    </button>
  );
}

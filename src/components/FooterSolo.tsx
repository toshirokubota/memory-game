import { formatTime } from "../libs";

type Props = {
    moves: number,
    elapsedTime: number
}

export default function FooterSolo(props: Props) {

    const moves = props.moves;
    const elapsedTime = props.elapsedTime;
    return (
        <footer className="grid grid-cols-2 gap-4 m-4">
            <span className='px-1 py-0.5 mx-1 bg-gray-300 text-slate-900 flex flex-col items-center rounded-sm'>
                <span className='text-sm font-bold text-slate-500'>Time:</span>
                <span className='text-2xl font-bold text-slate-700'>{formatTime(elapsedTime)}</span>
            </span>
            <span className='px-1 py-0.5 mx-1 bg-gray-300 text-slate-900 flex flex-col items-center rounded-sm'>
                <span className='text-sm font-bold text-slate-500'>Moves:</span>
                <span className='text-2xl font-bold text-slate-700'>{moves}</span>
            </span>
        </footer>
    )
}

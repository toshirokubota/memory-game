
type Props = {
    moves: number,
    elapsedTime: number
}

export default function FooterSolo(props: Props) {
    const moves = props.moves;
    const elapsedTime = props.elapsedTime;
    return (
        <footer className="flex justify-center">
            <span className='px-1 py-0.5 mx-1'>Times: {elapsedTime} </span>
            <span className='px-1 py-0.5 mx-1'>Moves: {moves}</span>
        </footer>
    )
}

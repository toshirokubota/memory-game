
export default function Header() {
    return (
        <header className='flex justify-between'>
            <h1>Memory</h1>
            <div>
                <button className='px-2 py-0.5 mx-1'>Restart</button>
                <button className='px-2 py-0.5 mx-1'>New Game</button>
            </div>
        </header>
    )
}
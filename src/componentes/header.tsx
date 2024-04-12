import icon from '../assets/dictionary-icon.svg'

export function Header(){
    return (
        <div className='flex items-center gap-5 py-2 bg-slate-800 bottom-5'>
            <img src={icon} alt='Logo' className='ml-2.5'/>

            <h1>My Dictionay</h1>
            
        </div>
    )
}
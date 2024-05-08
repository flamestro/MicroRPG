export type EntityState = {
    health: number,
    strength: number,
    name: string
}

export const Entity: React.FC<EntityState> = ({health, name, strength}) => {
    return (
        <div className='flex flex-col'>
            <p>{name}</p>
            <p>♥️ {health}</p>
            <p>⚔️ {strength}</p>
        </div>
    )
}

import {useEffect, useState} from "react";
import "./App.css";
import {Entity} from "./components/Entity.tsx";

type PlayerState = {
    health: number,
    strength: number,
    gold: number
}

type EnemyState = {
    health: number,
    strength: number,
}

const baseEnemyState = {
    health: 10,
    strength: 5,
}

const basePlayerState = {
    health: 100,
    strength: 10,
    gold: 0
}

const baseDojoStrength = 5
const baseRestHealth = 10
const baseRound = 1

function App() {
    const [playerState, setPlayerState] = useState<PlayerState>(basePlayerState)
    const [enemyState, setEnemyState] = useState<EnemyState>(baseEnemyState)
    const [round, setRound] = useState<number>(baseRound)
    const [gameRunning, setGameRunning] = useState(true)

    const [goldOnWin, _] = useState(10)
    const [restHealth, setRestHealth] = useState(baseRestHealth)
    const [dojoStrength, setDojoStrength] = useState(baseDojoStrength)

    useEffect(() => {
        setEnemyState({
            health: baseEnemyState.health + round * 2 + Math.pow(2, Math.round(round / 10)),
            strength: baseEnemyState.strength + round * 2 + Math.pow(2, Math.round(round / 10))
        })
    }, [round])

    const gameRunningGuard = (fn: () => void) => {
        if (gameRunning) {
            return fn
        } else {
            return () => {
            }
        }
    }
    const action = {
        fight: gameRunningGuard(() => {
            let playerHealth = playerState.health
            let enemyHealth = enemyState.health
            while (playerState.health > 0 && enemyHealth > 0) {
                enemyHealth -= playerState.strength
                if (enemyHealth > 0) {
                    playerHealth -= enemyState.strength
                }
            }
            if (playerHealth <= 0) {
                setGameRunning(false)
            }
            setEnemyState({...enemyState, health: enemyHealth})
            setPlayerState({...playerState, gold: playerState.gold + goldOnWin, health: playerHealth})
            setRound((x) => (x + 1))
        }),
        rest: gameRunningGuard(() => {
            if (playerState.gold >= 1) {
                setPlayerState(x => ({...x, health: x.health + restHealth, gold: x.gold - 1}))
                setRound((x) => (x + 1))
            }
        }),
        train: gameRunningGuard(() => {
            if (playerState.gold >= 10) {
                setPlayerState(x => ({...x, strength: x.strength + dojoStrength, gold: x.gold - 10}))
                setRound((x) => (x + 1))
            }
        }),
        upgradeDojo: gameRunningGuard(() => {
            if (playerState.gold >= 35) {
                setDojoStrength((x) => (
                    x + Math.pow(round, 2)
                ))
                setPlayerState(x => ({...x, gold: x.gold - 35}))

            }
        }),
        upgradeBed: gameRunningGuard(() => {
            if (playerState.gold >= 35) {
                setRestHealth((x) => (
                    x + Math.pow(round, 2)
                ))
                setPlayerState(x => ({...x, gold: x.gold - 35}))
            }
        }),
        restart: () => {
            setPlayerState(basePlayerState)
            setRound(baseRound)
            setEnemyState(baseEnemyState)
            setGameRunning(true)
            setRestHealth(baseRestHealth)
            setDojoStrength(baseDojoStrength)
        }
    }

    return (
        <div className="flex flex-col w-full h-full items-center gap-4">
            <div className="flex flex-col items-center relative">
                <h1 className={'text-2xl font-bold p-4 w-screen text-center border-b-2'}>MicroRPG!</h1>

                <button className={"absolute right-0 bottom-0 top-0 border-2 px-2 py-1 m-1 pointer"}
                        onClick={action.restart}>
                    Restart
                </button>
            </div>
            <h2 className={'text-xl'}>LEVEL {round}</h2>
            <div className={"flex flex-col  items-center "}>

                <div className={"flex flex-row gap-10"}>
                    <Entity name={'Player'} strength={playerState.strength} health={playerState.health}/>
                    <Entity name={'Enemy'} strength={enemyState.strength} health={enemyState.health}/>
                </div>
                <p>💰 {playerState.gold}</p>

            </div>

            <div className={'flex flex-col gap-2 items-center'}>
                <div className={'flex flex-row gap-1 items-center justify-center flex-wrap w-[300px]'}>
                    <button className={"border-2 px-2 py-1 m-1 pointer"} onClick={action.fight}
                            disabled={!gameRunning}>
                        Fight
                    </button>
                    <button className={"border-2 px-2 py-1 m-1 pointer"} onClick={action.rest}
                            disabled={!gameRunning}>
                        Rest
                    </button>
                    <button className={"border-2 px-2 py-1 m-1 pointer"} onClick={action.train}
                            disabled={!gameRunning}>
                        Training
                    </button>
                    <button className={"border-2 px-2 py-1 m-1 pointer"} onClick={action.upgradeDojo}
                            disabled={!gameRunning}>
                        Upgrade Dojo
                    </button>
                    <button className={"border-2 px-2 py-1 m-1 pointer"} onClick={action.upgradeBed}
                            disabled={!gameRunning}>
                        Upgrade Bed
                    </button>
                </div>

                <div className={'flex flex-row gap-4 mt-4'}>
                    <div className={"border-2 p-1"}>
                        <p>Actions:</p>
                        <p>Dojo: 10💰 = {dojoStrength} ⚔️</p>
                        <p>Bed: 1💰 = {restHealth} ♥️</p>
                    </div>
                    <div className={"border-2 p-1"}>
                        <p>Upgrades:</p>
                        <p>Dojo: 35💰 = {dojoStrength + Math.pow(round, 2)} ⚔️ on Training</p>
                        <p>Bed: 35💰 = {restHealth + Math.pow(round, 2)} ♥️ on Rest</p>
                    </div>
                </div>

                <p className={'p-4 text-gray-600 italic text-center'}>
                    Your enemy gets stronger every round, however, your upgrades also bring more perks every round. Time
                    your actions wisely to survive as long as possible.
                </p>
            </div>
        </div>
    )
        ;
}

export default App;

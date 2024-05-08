import {useEffect, useState} from "react";
import "./App.css";

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
            <div className="flex flex-col items-center">
                <h1 className={'text-2xl font-bold p-4 w-screen text-center border-b-2'}>MicroRPG!</h1>
                <p className={'p-4'}>Welcome to MicroRPG</p>
            </div>
            <h2>ROUND {round}</h2>
            <div className={"flex flex-col  items-center gap-10"}>

                <h3 className={'text-xl font-bold'}>
                    Stats
                </h3>
                <div className={"flex flex-row gap-10"}>
                    <div className={'flex flex-col'}>
                        <p>Player:</p>
                        <p>Health is {playerState.health}</p>
                        <p>Gold is {playerState.gold}</p>
                        <p>Strength is {playerState.strength}</p>

                    </div>
                    <div className={'flex flex-col'}>
                        <p>Enemy:</p>
                        <p>Health is {enemyState.health}</p>
                        <p>Strength is {enemyState.strength}</p>
                    </div>
                </div>

                <div className={'flex flex-col'}>
                    <p>Training: 10 Gold ={">"} {dojoStrength} Strength</p>
                    <p>Rest: 1 Gold ={">"} {restHealth} Health</p>
                    <br/>
                    <p>Upgrades:</p>
                    <p>Bed: 35 Gold ={">"} {restHealth + Math.pow(round, 2)} Health on Rest</p>
                    <p>Dojo: 35 Gold ={">"} {dojoStrength + Math.pow(round, 2)} Strength on Training</p>
                </div>
            </div>

            <div className={'flex flex-col gap-4 items-center'}>
                <h3 className={"text-xl font-bold"}>
                    Action
                </h3>
                <div className={'flex flex-col gap-1 items-center'}>
                    <div>
                        <button className={"border-2 p-2 m-2 pointer"} onClick={action.fight} disabled={!gameRunning}>
                            Fight
                        </button>
                        <button className={"border-2 p-2 m-2 pointer"} onClick={action.rest} disabled={!gameRunning}>
                            Rest
                        </button>
                        <button className={"border-2 p-2 m-2 pointer"} onClick={action.train} disabled={!gameRunning}>
                            Training
                        </button>
                    </div>
                    <div>
                        <button className={"border-2 p-2 m-2 pointer"} onClick={action.upgradeDojo}
                                disabled={!gameRunning}>
                            Upgrade Dojo
                        </button>
                        <button className={"border-2 p-2 m-2 pointer"} onClick={action.upgradeBed}
                                disabled={!gameRunning}>
                            Upgrade Bed
                        </button>
                    </div>
                    <div>
                        <button className={"border-2 p-2 m-2 pointer"} onClick={action.restart}>
                            Restart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default App;

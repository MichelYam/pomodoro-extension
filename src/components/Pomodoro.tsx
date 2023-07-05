import React, { useEffect, useState } from 'react'
import './style.css'
const buttonsModes = [
    {
        label: "Pomodoro",
        mode: "pomodoro"
    },
    {
        label: "Short break",
        mode: "shortBreak"
    },
    {
        label: "Long break",
        mode: "longBreak"
    },
]
const Index = () => {
    const [minutes, setMinutes] = useState<number>(25);
    const [seconds, setSeconds] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isBreak, setIsBreak] = useState<boolean>(false);
    const [newMinutes, setNewMinutes] = useState<number>(25);
    const [isSetting, setIsSetting] = useState<boolean>(false);
    const [currentTabs, setCurrentTabs] = useState<String>("pomodoro")
    let interval: NodeJS.Timeout | null = null;
    const startSound = new Audio(require('../sounds/button-sound.mp3'));
    const breakSound = new Audio(require('../sounds/break.mp3'))
    // // Lorsque l'extension est fermée
    // chrome.runtime.onSuspend.addListener(function() {
    //     // Enregistrer le temps actuel
    //     chrome.storage.local.set({ "temps": Date.now() });
    //   });

    //   // Lorsque l'extension est ouverte
    //   chrome.runtime.onStartup.addListener(function() {
    //     // Récupérer le temps enregistré
    //     chrome.storage.local.get("temps", function(data) {
    //       if (data.temps) {
    //         // Utiliser le temps enregistré pour effectuer des actions nécessaires
    //         console.log("Temps enregistré: " + data.temps);
    //       }
    //     });
    //   });
    useEffect(() => {

        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        setIsBreak(!isBreak);
                        breakSound.play()
                        setMinutes(isBreak ? newMinutes : 5);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
            }, 1000);
        } else {
            clearInterval(interval as unknown as NodeJS.Timeout);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, minutes, seconds, isBreak, newMinutes]);
    const handleMode = (event: any) => {
        const target = (event.target as HTMLInputElement)

        const { mode } = target.dataset;
        if (!mode) return;
        // console.log("test", timer)
        switchMode(mode);
        stopTimer();
    }
    const switchMode = (mode: string) => {
        setCurrentTabs(mode)
        let timerValue = 0
        switch (mode) {
            case "pomodoro":
                timerValue = 25
                break;
            case "shortBreak":
                timerValue = 5
                break;
            case "longBreak":
                timerValue = 10
                break;
            default:
                break;
        }
        // console.log("timer[mode]", timer[mode])
        setMinutes(timerValue)
        setSeconds(0)
        // console.log(timer)
        // updateClock();
    }
    const startTimer = () => {
        startSound.play()
        setIsActive(true);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(newMinutes);
        setSeconds(0);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setNewMinutes(parseInt(value));
    };

    const toggleSetting = () => {
        setIsSetting(!isSetting);
    };

    const stopTimer = () => {
        // clearInterval(interval);
        setIsActive(false)
    }

    return (
        <div className='timer'>
            <h1>Pomodoro Timer</h1>
            <h2>{isBreak ? 'RESTING' : 'WORKING'}</h2>
            <div className='buttons'>
                {buttonsModes.map((item, index) =>
                    <button key={index} onClick={handleMode} data-mode={item.mode} className={`button-mode ${item.mode === currentTabs ? "active" : ""}`}>
                        {item.label}
                    </button>
                )}
            </div>
            {
                !isSetting ? (
                    // <h2>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</h2>
                    <div className='clock'>
                        <span id='minutes'>{`${minutes.toString().padStart(2, '0')}`}</span>
                        <span className='separator'>:</span>
                        <span id='seconds'>{`${seconds.toString().padStart(2, '0')}`}</span>
                    </div>
                ) : (
                    <div className='control-input'>
                        <input type="number" value={newMinutes} min={1} max={60} onChange={handleMinutesChange} />
                        <button onClick={toggleSetting}>Save</button>
                    </div>
                )
            }
            <div className='group-btn'>
                {isActive ?
                    <button className='button stop-button' data-action="stop" onClick={stopTimer}>Stop</button>
                    :
                    <button className='button' onClick={startTimer}>Start</button>
                }
                <button className='button' onClick={resetTimer}>Reset</button>
                <button className='button' onClick={toggleSetting}>Change Minutes</button>
            </div>
        </div >
    );
};

export default Index
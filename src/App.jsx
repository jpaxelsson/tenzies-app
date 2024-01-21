import React from "react"
import { useState, useEffect } from "react"
// import moment from "moment"
import Die from "./Die"
// import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
import {nanoid} from 'nanoid'
import 'react-native-get-random-values'
import Confetti from 'react-confetti'

// let date_create = moment().format("YYYY-MM-DD hh:mm:ss")

export default function App() {

    const [dice, setDice] = useState(allNewDice)
    const [tenzies, setTenzies] = useState(false)
    const [rolls, setRolls] = useState(0)
    const [lowsetRolls, setLowestRolls] = useState(() => {
        const saved = localStorage.getItem("lowsetRolls");
        const initialValue = JSON.parse(saved);
        return initialValue || -1;
      });

    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            if (lowsetRolls === -1 || rolls < lowsetRolls)
                setLowestRolls(rolls)
        }
    }, [dice, rolls, lowsetRolls])

    useEffect(() => {
        localStorage.setItem("lowsetRolls", JSON.stringify(lowsetRolls));
      }, [lowsetRolls]);

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6), 
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        return Array(10).fill().map((v, i) => generateNewDie()); 
    }

    function rollDice() {
        setRolls(rolls+1)
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => (die.isHeld ? die : generateNewDie())))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
        }
    }

    const diceElements = dice.map(die =>  <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />)

    function holdDice(id) {
        setDice(dice.map(die => (die.id === id ? { ...die, isHeld: !die.isHeld } : die)));
    }

    return (<>      
          {/* <main>{date_create}</main> */}
          {/* {tenzies ? <Confetti /> : ""} */}
          
          
          <main>
            {tenzies && <Confetti numberOfPieces="2000" />}
            <h1 className="title">TENZIES</h1>

            <div className="score">
                <div>{lowsetRolls > -1 ? lowsetRolls : ''}</div> 
                <div>{rolls}</div>
            </div>
            
            <p className="instructions">Slå tärningarna tills alla visar samma värde. Klicka på en tärning för att frysa dess värde mellan slag.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className='roll-dice' onClick={rollDice}>{tenzies ? "Nytt spel" : "Slå"}</button>
          </main>
        </>
    )
};
import React from "react"
// import moment from "moment"
import Die from "./Die"
// import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'
import {nanoid} from 'nanoid'
import 'react-native-get-random-values'
import Confetti from 'react-confetti'

// let date_create = moment().format("YYYY-MM-DD hh:mm:ss")

export default function App() {

    const [dice, setDice] = React.useState(allNewDice)
    const [tenzies, setTenzies] = React.useState(false)

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6), 
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        // return Array.from({length: 10}, () => Math.ceil(Math.random() * 6))
        // return Array.from({length: 10}, ({value,isHeld,id}) => {
        //     generateNewDie()
        // })

        const newDice = []

        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }

        return newDice
    }

    function rollDice() {
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => (die.isHeld ? die : generateNewDie())))
        } else {
            setTenzies(false)
            setDice(allNewDice())
        }
    }

    const diceElements = dice.map(die =>  <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />)

    function holdDice(id) {
        setDice(dice.map(die => (die.id === id ? { ...die, isHeld: !die.isHeld } : die)));
    }

    return (<>      
          {/* <main>{date_create}</main> */}
          <main>
            {/* {tenzies ? <Confetti /> : ""} */}
            {tenzies && <Confetti numberOfPieces="2000" />}
            <h1 className="title">TENZIES</h1>
            <p className="instructions">Roll until all the dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className='roll-dice' onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
          </main>
        </>
    )
};
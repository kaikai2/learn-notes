import React, { useCallback, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Abc from './Abc';
import Main from './Main';
import {Note, NoteWithOctave} from 'tonal'
import { random } from 'lodash';

const lowest = Note.midi('C3') || 60
const highest = Note.midi('E5') || 60

const valid = (midi : number) => Note.get(Note.fromMidi(midi)).alt === 0
let validMidi: number[] = []
for (let midi = lowest; midi <= highest; midi++) {
  if (valid(midi)){
    validMidi.push(midi)
  }
}

function App() {

  const [problem, setProblem] = useState<NoteWithOctave>('C')
  const next = useCallback(() => {
    const toGuess = Note.fromMidi(validMidi[random(validMidi.length)])
    console.log("toGuess=", toGuess)
    setProblem(toGuess)
  }, [])
  useEffect(() => {
    next()
  }, [])

  return (
    <div className="App">
      <Main problem={problem} next={next}/>
    </div>
  );
}

export default App;

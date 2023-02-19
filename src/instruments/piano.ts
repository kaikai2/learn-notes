
import {Note, NoteWithOctave} from 'tonal'

const lowest = Note.midi('A0') || 60
const highest = Note.midi('C8') || 60

const valid = (midi : number) => Note.get(Note.fromMidi(midi)).alt === 0
let validMidi: number[] = []
for (let midi = lowest; midi <= highest; midi++) {
  if (valid(midi)){
    validMidi.push(midi)
  }
}


export default validMidi
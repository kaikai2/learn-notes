
import {Note, NoteName } from 'tonal'
import validMidi from './piano'

const lowest = Note.midi('C3') || 60
const highest = Note.midi('E5') || 60

const valid = (midi : number) => Note.get(Note.fromMidi(midi)).alt === 0

export const getValidMidi = () => {
    let validMidi: number[] = []
    for (let midi = lowest; midi <= highest; midi++) {
        if (valid(midi)){
            validMidi.push(midi)
        }
    }
    return validMidi
}
type Tuning = string

export const getPositions = (tuning: Tuning = 'C-G-D-A', position: string): {[key: NoteName]: number} => {
    if (tuning == 'C-G-D-A') {
        return {'C3': 3, 'G3' : 3, 'D4': 3, 'A4': 4}
    }
    return {'C3': 3, 'G3' : 3, 'D4': 3, 'A4': 4}
}

type Position = string
type StringName = string
type PositionMap = {[key: StringName]: NoteName[][]}

const positions: {[key:Position]: PositionMap} = {
    '1st': {
        // 0 (Open), 1st finger,    2nd finger, 3rd finger, 4th finger
        "A": [['A4'], ['A#4', 'B4'], ['C5', 'C#5'], ['D5'], ['D#5', 'E5']], // A string
        "D": [['D4'], ['D#4', 'E4'], ['F4', 'F#4'], ['G4'], ['G#4', 'A4']], // D string
        "G": [['G3'], ['G#3', 'A3'], ['A#3', 'B3'], ['C4'], ['C#4', 'D4']], // G string
        "C": [['C3'], ['C#3', 'D3'], ['D#3', 'E3'], ['F3'], ['F#3', 'G3']], // C string
    },
    // todo
    '2nd': {},
    '3rd': {},
    '4th': {},
    // ...
}
export const getFingerPositions = (stringName: StringName, position: Position): {[key: NoteName]: number} => { 
    if (position in positions && stringName in positions[position]) {
        const fingerPositions = positions[position][stringName]
        let map: {[key: NoteName]: number} = {}
        for (let i = 0; i < fingerPositions.length; i++){
            const notes = fingerPositions[i]
            for (let j in notes) {
                map[notes[j]] = i
            }
        }
        return map;
    }
    return {}
}
export const getFingerPosition = (note: NoteName, stringName: StringName, position: Position): number => {
    if (position in positions && stringName in positions[position]) {
        const fingerPositions = positions[position][stringName]
        for (let i = 0; i < fingerPositions.length; i++){
            if (note in fingerPositions[i]) {
                return i
            }
        }
        return -1
    }
    return -1
}
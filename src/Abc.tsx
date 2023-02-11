import React, { useEffect } from 'react';

import ABCJS from 'abcjs';
import { WebMidi } from 'webmidi';

import {Note} from 'tonal'
import AbcNotation from '@tonaljs/abc-notation'

type FullAbcProps = {
    note: string;
    showStaff: boolean;
    showTab: boolean;
    showNote: boolean;
}
type AbcProps = Partial<FullAbcProps>

const defaultAbcProps: AbcProps = {
    showStaff: true,
    showTab: false,
    showNote: true,
}

function Abc(props: AbcProps) {
    const resolvedProps = {
        ...defaultAbcProps,
        ...props
    }
    const midiInstrumentViola = '42'
    const header = `
X:1
% T:Viola 1st position
L:1
K:C clef=alto
[V:2 tab]
`
    const abcFullScale = header + `
"C" "0" "_C" C, "1" "_D" D, "2" "_E" E, "3" "_F" F, | "G" "0" "_G" G, "1" "_A" A, "2" "_B" B, "3" "_C" C | "D" "0" "_D" D "1" "_E" E "2" "_F" F "3" "_G" G | "A" "0" "_A" A "1" "_B" B "2" "_C" c "3" "_D" d "4" "_E" e |
    `;
    const playSound = ()=> {
        if (props.note !== undefined) {
            const pitch = Note.midi(AbcNotation.abcToScientificNotation(props.note))
            if (typeof(pitch) === "number") {
                console.log(pitch)
                const pitches : ABCJS.MidiPitches = [   // a C chord
                    {pitch:pitch,volume:105,duration:0.25,instrument:midiInstrumentViola,},
                ]
                ABCJS.synth.playEvent(pitches, [], 1000) // a measure takes one second. 
            }
        }
    }

    useEffect(() => {
        const noteLetter = Note.get(AbcNotation.abcToScientificNotation(props.note || "C")).letter
        const noteDesc = resolvedProps.showNote ? `"${noteLetter}"` : ""
        console.log(resolvedProps.showNote)
        console.log(noteDesc)
        const abc = header + ` ${noteDesc} "_"${props.note}`
        console.log(abc)
        var options4 = {
            scale: 2,
            tablature: resolvedProps.showTab ? [
                {
                    instrument: 'violin',
                    label: 'Viola (%T)',
                    tuning: ['C,', 'G,', 'D', 'A']
                }
            ] : undefined,
            staffwidth: 500,
            paddingleft: 10,
            viewportVertical: 0,
            add_classes: true,
            output: "svg"

        }
        
        ABCJS.renderAbc("paper", abc, options4 as any)
       
        return () => {
            console.log('Abc destroy')
        }
    }, [props])

    return (
        <>
            <div onClick={playSound}>
                <span>{`ShowStaff: ${resolvedProps.showStaff}`}, </span>
                <span>{`ShowTab: ${resolvedProps.showTab}`}, </span>
                <span>{`showNote: ${resolvedProps.showNote}`}</span>
            </div>
            <div id="paper">
            </div>
        </>
    )
}

export default Abc;

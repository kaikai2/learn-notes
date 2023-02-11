import React, { ChangeEvent, useEffect, useState } from 'react';
import { Alert, ToggleButton, Button, ButtonGroup, ToggleButtonGroup } from 'react-bootstrap';

import Abc from './Abc'
import {Note, NoteWithOctave} from 'tonal'
import AbcNotation from '@tonaljs/abc-notation'

type MainProps = {
    problem: NoteWithOctave; // Scientific Note notation
    next: CallableFunction;
}

function Main(props: MainProps) {

    const [showOptions, setShowOptions] = useState(['showStaff', 'showTab', 'showNote'])
    const [note, setNote] = useState("C")
    const [answeredNote, setAnsweredNote] = useState<string|undefined>(undefined)
    const [problemNote, setProblemNote] = useState<string>()

    useEffect(() => {
        setProblemNote(Note.get(props.problem).letter || "C")
        return () => {
            console.log('Main destroy')
        }
    })

    return (
        <div id="main">
            <ToggleButtonGroup type="checkbox" value={showOptions} onChange={(val) => setShowOptions(val)}>
                <ToggleButton id="showStaff" value="showStaff">
                    Show staff
                </ToggleButton>
                <ToggleButton id="showTAB" value="showTab">
                    Show TAB
                </ToggleButton>
                <ToggleButton id="showNote" value="showNote">
                    Show Note
                </ToggleButton>
            </ToggleButtonGroup>
            <Abc note={AbcNotation.scientificToAbcNotation(props.problem || "C")}
                showStaff={showOptions.indexOf('showStaff') != -1} 
                showTab={showOptions.indexOf('showTab') != -1} 
                showNote={showOptions.indexOf('showNote') != -1 && answeredNote !== undefined}/>
            <hr/>
            {'CDEFGAB'.split('').map((noteLetter) => 
                <>
                    <Button variant={
                        answeredNote === undefined || answeredNote !== noteLetter  ? "outline-primary" : problemNote === noteLetter ? "success" : "danger"} size="lg" onClick={() => setAnsweredNote(noteLetter)}>
                        {noteLetter}
                    </Button>
                    {' '}
                </>
            )}
            <hr/>
            <Alert show={answeredNote !== undefined} variant={answeredNote === problemNote ? "success" : "danger"}>
                <Alert.Heading>
                    {answeredNote === problemNote ? "Well done!" : "Incorrect!"}
                </Alert.Heading>
                <hr/>
                {`answeredNote=${answeredNote}, problemNote=${problemNote}, props.problem=${props.problem}, ${Note.get(props.problem).letter}`}
            </Alert>

            <div className='d-grid gap-2'>
                <Button variant="primary" disabled={answeredNote === undefined} size="lg" onClick={() => {
                    setAnsweredNote(undefined)
                    props.next()
                }}>Next</Button>
            </div>
            <hr/>


        </div>
    )
}

export default Main;
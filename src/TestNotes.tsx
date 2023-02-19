import React, { useCallback,  useEffect, useState } from 'react';
import Abc from './Abc'
import {Note, NoteName} from 'tonal'
import AbcNotation from '@tonaljs/abc-notation'

import {Alert, Button, Drawer, Layout, Switch, Radio, Row, Col } from 'antd'
import type {RadioChangeEvent} from 'antd'
import { useAppSelector, useAppDispatch } from './app/hooks'
import { random, map } from 'lodash';
import { getValidMidi } from './instruments/viola'
import { decrement, increment } from './features/counter/counterSlice'
import moment from 'moment'

type TestNotesProps = {
}

const TestNotes: React.FC<TestNotesProps> = (props: TestNotesProps) => {

    const [problem, setProblem] = useState<NoteName>('C')

    const [showStaff, setShowStaff] = useState(true)
    const [showTab, setShowTab] = useState(true)
    const [showNote, setShowNote] = useState(true)

    const [answeredNote, setAnsweredNote] = useState<string|undefined>(undefined)

    const [beginTime, setBeginTime] = useState<moment.Moment>()
    const [endTime, setEndTime] = useState<moment.Moment>()

    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()
    const [openSettings, setOpenSettings] = useState(false);
  
    const next = useCallback(() => {
        const validMidi = getValidMidi()
        console.log('validMidi=', validMidi)
        const randomIndex = random(validMidi.length - 1)
        const toGuess = Note.fromMidi(validMidi[randomIndex])
    
        console.log(`randomIndex=${randomIndex}, toGuess=${toGuess}, validMidi=${validMidi}, ${Note.fromMidi(60)}`)
        setProblem(toGuess)
        setBeginTime(moment())
    }, [])

    useEffect(() => {
        next()
    }, [])

  
    return (
        <Layout>
            <Layout.Header>
                Header
                <Button type="primary" onClick={() => {
                    setOpenSettings(true);
                }}>Settings</Button>
                <Drawer title="Settings" placement="right" onClose={() => {
                    setOpenSettings(false);
                }} open={openSettings}>
                    <p>Show staff <Switch style={{float: "right"}} checked={showStaff} onChange={setShowStaff}/></p>
                    <p>Show TAB   <Switch style={{float: "right"}} checked={showTab} onChange={setShowTab}/></p>
                    <p>Show note  <Switch style={{float: "right"}} checked={showNote} onChange={setShowNote}/></p>
                </Drawer>

            </Layout.Header>
            <Layout>
                <Layout.Content>
                    <Row>
                        <Col span={24}>
                            <p>What is the letter of this note?</p>
                            <hr/>
                        </Col>
                    </Row>
                    <Row>
                        <Col 
                            xs={{span:20, offset:2}} 
                            sm={{span:14, offset:5}} 
                            md={{span:10, offset:7}} 
                            lg={{span:8, offset:8}}
                            xl={{span:6, offset:9}}>
                            <Abc note={AbcNotation.scientificToAbcNotation(problem || "C")}
                                showStaff={showStaff} 
                                showTab={showTab} 
                                showNote={showNote && answeredNote !== undefined}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={5}/>
                        {'CDEFGAB'.split('').map((noteLetter) => 
                        <Col span={2} key={noteLetter} >
                            <Button
                                type={answeredNote === undefined ? "default" : "primary"}
                                disabled={answeredNote !== undefined && noteLetter !== Note.get(problem).letter && noteLetter !== answeredNote} 
                                danger={answeredNote !== undefined && answeredNote === noteLetter && answeredNote !== problem}
                                shape="circle" 
                                onClick={()=> {
                                    setEndTime(moment())
                                    setAnsweredNote(noteLetter)
                                }}
                                size="large">
                                {noteLetter}
                            </Button>
                        </Col>
                        )}
                    </Row>
                </Layout.Content>
            </Layout>
            <Layout.Footer>
                {answeredNote !== undefined ? <Alert
                    type={answeredNote === Note.get(problem).letter ? "success" : "error"}
                    message={answeredNote === Note.get(problem).letter ? "Correct! Well done!" : "Incorrect!"}
                    description={`The note is ${Note.get(problem).letter}. Your answer is ${answeredNote}. You took ${moment.duration(endTime!.diff(beginTime)).asSeconds()}s.`}
                /> : null}
                <Button block type="primary" disabled={answeredNote === undefined} size="large" onClick={() => {
                    setAnsweredNote(undefined)
                    next()
                }}>Next</Button>
            </Layout.Footer>
        </Layout>
    )
}

export default TestNotes;
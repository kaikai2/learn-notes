import React, { useCallback, useEffect, useState } from 'react';

import Abc from './Abc'
import {Note, NoteWithOctave} from 'tonal'
import AbcNotation from '@tonaljs/abc-notation'
import { random, map } from 'lodash';
import { getValidMidi, getPositions, getFingerPosition, getFingerPositions } from './instruments/viola'

import {Alert, Button, Drawer, Layout, Switch, Radio, Row, Col, Typography } from 'antd'
import type {RadioChangeEvent} from 'antd'
import { useAppSelector, useAppDispatch } from './app/hooks'
import moment from 'moment'

import { decrement, increment } from './features/counter/counterSlice'
import { notEqual } from 'assert';
type TestPositionProps = {
}

const TestPosition: React.FC<TestPositionProps> = (props: TestPositionProps) => {

    const [problem, setProblem] = useState<NoteWithOctave>('C')

    const tuning = 'C-G-D-A'
    const position = '1st'
    const [showStaff, setShowStaff] = useState(true)
    const [showNote, setShowNote] = useState(true)

    const [answeredNote, setAnsweredNote] = useState<string|undefined>(undefined)
    const [beginTime, setBeginTime] = useState<moment.Moment>()
    const [endTime, setEndTime] = useState<moment.Moment>()

    const count = useAppSelector((state) => state.counter.value)
    const dispatch = useAppDispatch()

    const [openSettings, setOpenSettings] = useState(false);
  
    const next = useCallback(() => {
        const validMidi = getValidMidi()
        const randomIndex = random(validMidi.length - 1)
        const toGuess = Note.fromMidi(validMidi[randomIndex])
    
        console.log(`randomIndex=${randomIndex}, toGuess=${toGuess}, validMidi=${validMidi}, ${Note.fromMidi(60)}`)
        setProblem(toGuess)
        setBeginTime(moment())
      }, [])
    
      useEffect(() => {
        console.log(getFingerPositions('C', '1st'))
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
                    <p>Show note  <Switch style={{float: "right"}} checked={showNote} onChange={setShowNote}/></p>
                </Drawer>

            </Layout.Header>
            <Layout>
                <Layout.Content>
                    <Row>
                        <Col span={24}>
                            <p>Which finger position is this note in {position} position?</p>
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
                                showTab={false} 
                                showNote={showNote && answeredNote !== undefined}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {['A', 'D', 'G', 'C'].map((stringName) => 
                                <>
                                    <Row key={`string-${stringName}`}>
                                        <Col span={19} offset={3}>
                                            <hr style={{float: 'left', width: '100%', position:'relative', top:'2em'}}/>
                                        </Col>
                                    </Row>
                                    <Row key={stringName}>
                                        <Col span={4}>
                                            <Typography.Text strong type="secondary"  style={{position:'relative', top:'0.5em'}} >{stringName}</Typography.Text>
                                        </Col>
                                        {map(getFingerPositions(stringName, '1st'), (position, note) => 
                                            <Col span={2} key={`${note}-${position}`}>
                                                <Button
                                                    type={answeredNote === undefined ? "default" : "primary"}
                                                    disabled={answeredNote !== undefined && note !== problem && note !== answeredNote} 
                                                    danger={answeredNote !== undefined && answeredNote === note && answeredNote !== problem}
                                                    shape="circle" 
                                                    onClick={()=> {
                                                        setEndTime(moment())
                                                        setAnsweredNote(note)
                                                    }}
                                                    size="large">
                                                    {position}
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                                </>
                            )}
                            <hr/>
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>
            <Layout.Footer>
                {answeredNote !== undefined ? <Alert
                    type={answeredNote === problem ? "success" : "error"}
                    message={answeredNote === problem ? "Correct! Well done!" : "Incorrect!"}
                    description={`The note is ${problem}. Your answer is ${answeredNote}. You took ${moment.duration(endTime!.diff(beginTime)).asSeconds()}s.`}
                /> : null}
                <Button block type="primary" disabled={answeredNote === undefined} size="large" onClick={() => {
                    setAnsweredNote(undefined)
                    next()
                }}>Next</Button>
            </Layout.Footer>
        </Layout>
    )
}

export default TestPosition;
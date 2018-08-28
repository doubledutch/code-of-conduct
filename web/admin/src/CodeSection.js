/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react'
import './App.css'
import { TextInput } from '@doubledutch/react-components'

export default class CodeSection extends Component {
  constructor() {
    super()
    this.state = {
      showStaticBox: true,
      input: "",
      clickable:true
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({input: nextProps.codeOfConductDraft.text})
  }


  render() {
    const { codeOfConduct, codeOfConductDraft, handleChange, isCodeBoxDisplay, saveCodeOfConduct, saveDraftCodeOfConduct } = this.props
    const isDraftChanges = (this.state.input !== codeOfConductDraft.text)
    const isPublishChanges = (this.state.input !== codeOfConduct.text)
    const currentState = this.findCurrentState()
    const publishTime = codeOfConduct.publishTime ? new Date(codeOfConduct.publishTime).toLocaleString() : ""
    const inputIsNotEmpty = this.state.input ? this.state.input.trim().length > 0 : false
    return (
      <div className="sectionContainer">
        <div className="codeOfConductContainerRow">
          <h2 className="titleWithDescription">Code of Conduct</h2>
          {currentState === "Published" && <p className="statusTextGreen">{currentState}</p>}
          {currentState === "Draft" && <p className="statusTextYellow">{currentState}</p>}
          {isCodeBoxDisplay && <p className="timeText">{publishTime}</p>}
          <div className="flex"/>
          <button className="displayButton" onClick={() => handleChange("isCodeBoxDisplay", !isCodeBoxDisplay)}>{(isCodeBoxDisplay ? "Hide Section" : "Show Section")}</button>
        </div>
        { isCodeBoxDisplay && <div>
          {this.state.showStaticBox && !codeOfConductDraft.text ? <button onClick={this.openEditText} value="boxButton"  className="placeHolderTextBox">
            <span className="placeHolderTextLine">
              <p className="placeHolderText">Enter code of conduct text here or</p>
              <button value="defaultButton"  onClick={this.addDefaultCode} className="noBorderButtonBlue">add default code of conduct</button>
            </span>
          </button> : <TextInput 
            multiline
            autoFocus={!this.state.showStaticBox}
            value={this.state.input}
            onChange={e => this.setState({input: e.target.value})}
            className="completeText" /> }
            <div className="codeButtonsContainer">
              <p>DoubleDutch hereby disclaims any and all liability in connection with this Code of Conduct.</p>
              <div style={{flex: 1}}/>
              { isDraftChanges && inputIsNotEmpty && <button onClick={() => saveDraftCodeOfConduct(this.state.input)}className="dd-bordered">Save as Draft</button> }
              { isPublishChanges && inputIsNotEmpty && <button onClick={() => saveCodeOfConduct(this.state.input)}className="dd-bordered button-margin">Publish to App</button> }
            </div>
          </div> }
        </div>
    )
  }

  findCurrentState = () => {
    let stateText = ""
    if (this.props.codeOfConductDraft.text) {
      if (this.props.codeOfConduct.text === this.props.codeOfConductDraft.text) {
        stateText = "Published"
      }
      else {
        stateText = "Draft"
      }
    }
    return stateText
  }

  openEditText = (e) => {
    if (e.target.value === "boxButton") this.setState({showStaticBox: false, input: this.props.codeOfConductDraft.text || ''})
  }

  addDefaultCode = (e) => {
    this.setState({showStaticBox: false, input: defaultCode, clickable: false})
  }

}

const defaultCode = `All attendees, speakers, sponsors and volunteers at our event are required to agree with the following code of conduct. Organizers will enforce this code throughout the event. We are expecting cooperation from all participants to help ensure a safe environment for everybody. 

Unacceptable Behavior 
The following behaviors are considered harassment and are unacceptable within our community:
● Violence, threats of violence or violent language directed against another person.
● Sexist, racist, homophobic, transphobic, ableist or otherwise discriminatory jokes and language.
● Posting or displaying sexually explicit or violent material.
● Posting or threatening to post other people’s personally identifying information ('doxing').
● Personal insults, particularly those related to gender, sexual orientation, race, religion, or disability.
● Inappropriate photography or recording.
● Inappropriate physical contact. You should have someone’s consent before touching them.
● Unwelcome sexual attention. This includes, sexualized comments or jokes; inappropriate touching, groping, and unwelcomed sexual advances.
● Deliberate intimidation, stalking or following (online or in person).
● Advocating for, or encouraging, any of the above behavior.
● Sustained disruption of community events, including talks and presentations.

Consequences of Unacceptable Behavior
Unacceptable behavior from any community member, including sponsors and those with decision-making authority, will not be tolerated. Anyone asked to stop unacceptable behavior is expected to comply immediately. If a community member engages in unacceptable behavior, the community organizers may take any action they deem appropriate, up to and including a temporary ban or permanent expulsion from the community without warning and without refund. We expect participants to follow this code of conduct at all event venues and event related social events.

Reporting
If someone makes you or anyone else feel unsafe or unwelcome, please report it as soon as possible. Harassment and other code of conduct violations reduce the value of our event for everyone. We want you to be safe and happy at our event. People like you make our event a better place. You can make a report either personally or anonymously. Reporting personally can be done directly to event staff and volunteers. They can be identified by special badges throughout the event venue. Anonymous reporting can be done here. Event staff will help participants contact hotel/venue security or local law enforcement, provide escorts, or otherwise assist those experiencing harassment to feel safe for the duration of the event. We value your attendance.

Sponsors and exhibitors
Sponsors and exhibitors are also subject to the anti-harassment policy. In particular, exhibitors are asked to not use sexualized images, activities, or other material, and their staff (including volunteers) should not use sexualized clothing/uniforms/costumes, or otherwise create a sexualized environment.`

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
import CsvParse from '@vtex/react-csv-parse'
import { CSVLink } from 'react-csv'
import { TextInput } from '@doubledutch/react-components'
import client, { translate as t } from '@doubledutch/admin-client'
import RadioIcon from './RadioIcon'

export default class CustomCodeSection extends Component {
  constructor() {
    super()
    this.state = {
      showStaticBox: true,
      input: '',
      clickable: true,
      title: '',
      successfulImport: 0,
      totalImport: 0,
      fileError: false,
      dupError: false,
      importedUsers: [],
      rawData: [],
      customQuestion: '',
      isTrueFalse: false,
    }
  }

  componentDidMount() {
    const input = this.props.selectedCodeOfConductDraft.text
    const title = this.props.title
    const customQuestion = this.props.selectedCodeOfConductDraft.question
      ? this.props.selectedCodeOfConductDraft.question.text
      : ''
    const isTrueFalse = this.props.selectedCodeOfConductDraft.question
      ? this.props.selectedCodeOfConductDraft.question.isTrueFalse
      : false
    this.setState({ input, title, customQuestion, isTrueFalse })
  }

  render() {
    const { selectedCodeOfConductDraft, isCodeBoxDisplay, history } = this.props
    const selectedCodeOfConduct = this.props.selectedCodeOfConduct || {
      input: '',
      question: { text: '', isTrueFalse: undefined },
      attendees: [],
      title: '',
    }
    const questionDraft = selectedCodeOfConductDraft.question
      ? selectedCodeOfConductDraft.question.text
      : ''
    const question = selectedCodeOfConduct.question ? selectedCodeOfConduct.question.text : ''
    const isDraftChanges =
      this.state.input !== selectedCodeOfConductDraft.text ||
      this.state.customQuestion !== questionDraft
    const isPublishChanges =
      this.state.input !== selectedCodeOfConduct.text || this.state.customQuestion !== question
    const currentState = this.findCurrentState()
    const publishTime = selectedCodeOfConduct.publishTime
      ? new Date(selectedCodeOfConduct.publishTime).toLocaleString()
      : ''
    const inputIsNotEmpty = this.state.input ? this.state.input.trim().length > 0 : false
    const isImportedUsers = this.state.importedUsers.length > 0
    return (
      <div>
        <button className="dd-bordered" onClick={() => this.props.backAction({ history })}>
          {t('back')}
        </button>
        <div className="sectionContainer">
          <div className="codeOfConductContainerRow">
            <h2 className="titleWithDescription">{t('customCode')}</h2>
            {currentState === 'Published' && <p className="statusTextGreen">{currentState}</p>}
            {currentState === 'Draft' && <p className="statusTextYellow">{currentState}</p>}
            {isCodeBoxDisplay && <p className="timeText">{publishTime}</p>}
            <div className="flex" />
          </div>
          {isCodeBoxDisplay && (
            <div>
              <TextInput
                label="Title"
                placeholder="Ex. VIPs"
                value={this.state.title}
                onChange={e => this.setState({ title: e.target.value })}
                className="titleInput"
              />
              {this.state.showStaticBox && !selectedCodeOfConductDraft.text ? (
                <div onClick={this.openEditText} value="boxButton" className="placeHolderTextBox">
                  <span className="placeHolderTextLine">
                    <p className="placeHolderText">{t('enterCode')}</p>
                    <button
                      value="defaultButton"
                      onClick={this.addDefaultCode}
                      className="noBorderButtonBlue"
                    >
                      {t('addCode')}
                    </button>
                  </span>
                </div>
              ) : (
                <TextInput
                  multiline
                  autoFocus={!this.state.showStaticBox}
                  value={this.state.input}
                  onChange={e => this.setState({ input: e.target.value })}
                />
              )}
              <TextInput
                label={t('questionTypeLabel')}
                placeholder="Ex. "
                value={this.state.customQuestion}
                onChange={e => this.setState({ customQuestion: e.target.value })}
              />
              {this.state.customQuestion.length > 0 ? (
                <div>
                  <p>{t('questionType')}</p>
                  <RadioIcon
                    checked={this.state.isTrueFalse}
                    onTrueFalse={() => this.setState({ isTrueFalse: true })}
                    onFreeEntry={() => this.setState({ isTrueFalse: false })}
                  />
                </div>
              ) : null}
              {this.renderCSVBox()}
              <div className="codeButtonsContainer">
                <p>{t('disclaimer')}</p>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() =>
                    this.props.deleteCustomCodeOfConduct(this.props.title, { history })
                  }
                  className="dd-bordered button-margin button-red"
                >
                  {t('delete')}
                </button>
                {isDraftChanges && inputIsNotEmpty && (
                  <button onClick={this.handleDraftSave} className="dd-bordered">
                    {t('draft')}
                  </button>
                )}
                {isPublishChanges &&
                  inputIsNotEmpty &&
                  (isImportedUsers || this.props.selectedCodeOfConductDraft.users) && (
                    <button onClick={this.handleSave} className="dd-bordered button-margin">
                      {t('publishApp')}
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  renderCSVBox = () => (
    <div>
      <h2 className="importTitle">{t('importList')}</h2>
      <p className="titleHelp">{t('importListHelp')}</p>
      <div>
        <CsvParse
          className="csv-input"
          keys={['email']}
          onDataUploaded={this.handleImport}
          onError={this.props.handleError}
          render={onChange => <input type="file" onChange={onChange} />}
        />
        {this.props.selectedCodeOfConductDraft.users ? (
          <CSVLink data={this.props.selectedCodeOfConductDraft.users} filename="questions.csv">
            {t('downloadUpload')}
          </CSVLink>
        ) : null}
      </div>
      {this.state.totalImport > 0 && (
        <h2 className="successText">
          {t('success', {
            successfulImport: this.state.successfulImport,
            totalImport: this.state.totalImport,
          })}
        </h2>
      )}
      {/* {this.state.totalImport > 0 && this.state.successfulImport === 0 && (
        <h2 className="failText">{t('fail')}</h2>
      )} */}
      {this.state.dupError && <h2 className="failText">{t('dupError')}</h2>}
      {this.state.fileError && <h2 className="failText">{t('failError')}</h2>}
    </div>
  )

  handleImport = data => {
    const newData = []
    const attendeeImportPromises = data
      .filter(cell => isValid(cell.email) && isValidASC(cell.email))
      .map(cell =>
        client
          .getAttendees(cell.email)
          .then(attendees => ({ ...attendees[0] }))
          .catch(err => 'error'),
      )
    Promise.all(attendeeImportPromises).then(attendees => {
      attendees = attendees.filter(user => user.id)
      let error = false
      if (attendees.length === 0) {
        error = true
        this.setState({ fileError: true })
      }
      attendees.forEach(user => {
        if (user.id && this.props.perUserInfo) {
          const userData = this.props.perUserInfo[user.id]
          if (userData.customCode) {
            if (userData.customCode !== this.state.title) {
              this.setState({ dupError: true })
              error = true
            }
          } else {
            newData.push(user)
          }
        }
      })
      if (error === false) {
        this.setState({ importedUsers: attendees, rawData: data, DupError: false })
      }
    })
  }

  handleDraftSave = () => {
    const attendees = this.state.importedUsers
    const data = this.state.rawData
    const history = this.props.history
    data.forEach(userInfo => {
      const currentUser = attendees.find(user => (user ? user.email === userInfo.email : undefined))
      if (currentUser) {
        this.props.fbc.database.private
          .adminableUsersRef(currentUser.id)
          .child('customCode')
          .set(this.state.title)
      }
    })
    this.props.saveDraftCustomCodeOfConduct(
      this.state.input,
      this.state.title,
      attendees,
      {
        text: this.state.customQuestion || '',
        isTrueFalse: this.state.isTrueFalse,
      },
      { history },
    )
  }

  handleSave = () => {
    const attendees = this.state.importedUsers
    const data = this.state.rawData
    data.forEach(userInfo => {
      const currentUser = attendees.find(user => (user ? user.email === userInfo.email : undefined))
      if (currentUser) {
        this.props.fbc.database.private
          .adminableUsersRef(currentUser.id)
          .child('customCode')
          .set(this.state.title)
      }
    })
    const history = this.props.history
    this.props.saveCustomCodeOfConduct(
      this.state.input,
      this.state.title,
      attendees,
      { history },
      { text: this.state.customQuestion, isTrueFalse: this.state.isTrueFalse },
    )
  }

  findCurrentState = () => {
    const selectedCodeOfConduct = this.props.selectedCodeOfConduct || {
      input: '',
      question: { text: '', isTrueFalse: undefined },
      attendees: [],
      title: '',
    }
    let stateText = ''
    if (this.props.selectedCodeOfConductDraft.text) {
      if (selectedCodeOfConduct.text === this.props.selectedCodeOfConductDraft.text) {
        stateText = 'Published'
      } else {
        stateText = 'Draft'
      }
    }
    return stateText
  }

  openEditText = e => {
    if (e.target.value !== 'defaultButton')
      this.setState({
        showStaticBox: false,
        input: this.props.selectedCodeOfConductDraft.text || '',
      })
  }

  addDefaultCode = e => {
    this.setState({ showStaticBox: false, input: defaultCode, clickable: false })
  }
}

function isValidASC(str) {
  return !/^[\x00-\x20]*$/.test(str)
}

function isValid(str) {
  return !/[~`!#$%\^&*=�\\[\]\\';,/{}|\\":<>\?]/g.test(str)
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

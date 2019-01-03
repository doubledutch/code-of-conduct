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
import { translate as t } from '@doubledutch/admin-client'
import { CSVLink, CSVDownload } from 'react-csv'

export default class AssignSection extends Component {
  constructor() {
    super()
    this.state = {
      exporting: false,
      exportList: [],
    }
  }

  componentWillReceiveProps(nextProps) {}

  render() {
    const { isAssignBoxDisplay, handleChange, history, codes } = this.props
    const codesKeys = Object.keys(codes)
    return (
      <div className="sectionContainer">
        <div className="codeOfConductContainerRow">
          <h2 className="titleWithDescription">{t('customCode')}</h2>
          {isAssignBoxDisplay && (
            <button
              onClick={() => this.props.addNewCode(history)}
              className="dd-bordered topButton"
            >
              {t('addNew')}
            </button>
          )}
          <div className="flex" />
          <button
            className="displayButton"
            onClick={() => handleChange('isAssignBoxDisplay', !isAssignBoxDisplay)}
          >
            {isAssignBoxDisplay ? 'Hide Section' : 'Show Section'}
          </button>
        </div>
        {isAssignBoxDisplay && (
          <div>
            <div className="codeTable">
              {codesKeys.map(key => this.tableCell(key))}
              {codesKeys.length === 0 && (
                <div className="centerBox">
                  <h3>{t('noCodeHelp')}</h3>
                </div>
              )}
            </div>
            <div className="csvLinkBox">
              <button className="button" onClick={this.prepareCSV}>
                {t('export')}
              </button>
              {this.state.exporting ? (
                <CSVDownload data={this.state.exportList} target="_blank" filename="my-file.csv" />
              ) : null}
            </div>
          </div>
        )}
      </div>
    )
  }

  tableCell = key => {
    const currentState = this.findCurrentState(key)
    return (
      <div className="codeRow">
        <p>{key}</p>
        <div className="flex" />
        {currentState === 'Published' && <p className="statusTextGreen-inline">{currentState}</p>}
        {currentState === 'Draft' && <p className="statusTextYellow-inline">{currentState}</p>}
        <button
          className="noBorderButtonBlue"
          onClick={() => this.props.editCustomCode(key, this.props.history)}
        >
          {t('edit')}
        </button>
      </div>
    )
  }

  findCurrentState = key => {
    const selectedCodeOfConduct = this.props.codes[key] || {}
    const selectedCodeOfConductPublished = this.props.codesPublished[key] || {}
    let stateText = 'Draft'
    if (selectedCodeOfConductPublished.text) {
      if (selectedCodeOfConduct.text === selectedCodeOfConductPublished.text) {
        stateText = 'Published'
      }
    }
    return stateText
  }

  prepareCSV = () => {
    if (this.state.exporting) {
      return
    }
    const status = Object.values(this.props.status)
    let newList = []
    const attendeeClickPromises = status.map(result =>
      this.props.client
        .getAttendee(result.userId)
        .then(attendee => ({ ...result, ...attendee, surveyTitle: result.id }))
        .catch(err => result),
    )
    Promise.all(attendeeClickPromises).then(newResults => {
      // Build CSV and trigger download...
      newList = this.parseResultsForExport(newResults)
      this.setState({ exporting: true, exportList: newList })
      setTimeout(() => this.setState({ exporting: false, newList: [] }), 3000)
    })
  }

  parseResultsForExport = results => {
    const parsedResults = []
    results.forEach(item => {
      const newItem = {
        code_of_conduct_title: item.surveyTitle,
        custom_question_response: item.questionResponse,
        name: `${item.firstName} ${item.lastName}`,
        email: item.email,
      }
      parsedResults.push(newItem)
    })
    return parsedResults
  }
}

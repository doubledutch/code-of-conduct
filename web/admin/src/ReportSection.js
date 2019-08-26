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
import { CSVLink } from '@doubledutch/react-csv'
import client, { translate as t } from '@doubledutch/admin-client'
import LeftReport from './LeftReport'
import RightReport from './RightReport'

export default class ReportSection extends Component {
  render() {
    const reports = Object.values(this.props.reports)
    const newReports = reports
      .filter(report => report.status === 'Received')
      .sort((a, b) => b.dateCreate - a.dateCreate)
    const resolvedReports = reports
      .filter(report => report.status !== 'Received')
      .sort((a, b) => b.dateCreate - a.dateCreate)
    return (
      <div className="sectionContainerSpace">
        <div className="containerRow">
          <h2 className="titleWithDescription">{t('reported')}</h2>
          <button
            className="displayButton"
            onClick={() =>
              this.props.handleChange('isReportsBoxDisplay', !this.props.isReportsBoxDisplay)
            }
          >
            {this.props.isReportsBoxDisplay ? t('hide') : t('view')}
          </button>
        </div>
        {this.props.isReportsBoxDisplay && (
          <div className="reportsContainer">
            <LeftReport
              reports={newReports}
              resolveItem={this.props.resolveItem}
              showMakeReport={this.props.showMakeReport}
            />
            <span className="largeSpacer" />
            <RightReport reports={resolvedReports} viewResolution={this.props.viewResolution} />
          </div>
        )}
        {this.props.isReportsBoxDisplay && (
          <CSVLink className="csvButton" data={getCsvData(reports)} filename="questions.csv">
            {t('export')}
          </CSVLink>
        )}
      </div>
    )
  }
}

function getCsvData(reports) {
  return reports.map(report => {
    const user = report.isAnom
      ? 'anonymous'
      : `${report.creator.firstName} ${report.creator.lastName}`
    const dateCreated = new Date(report.dateCreate).toDateString()
    const preferredContact = report.phone ? report.phone : report.preferredContact
    return {
      dateCreated,
      user,
      email: report.isAnom ? 'Anonymous' : report.creator.email,
      description: report.description,
      status: report.status,
      preferredContact,
      reportMadeBy: report.reportPerson || user,
      resolution: report.resolution,
      resolutionBy: report.resolutionPerson,
    }
  })
}

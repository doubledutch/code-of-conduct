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
import { translate as t } from '@doubledutch/admin-client'
import ReportCell from './ReportCell'

export default class LeftReport extends Component {
  render() {
    const { reports } = this.props
    return (
      <div style={{ flex: 1 }}>
        <div className="headerBox">
          <p>{t('newReport', { total: reports.length })}</p>
          <div className="flexSpace" />
          <button className="noBorderButtonBlue" onClick={this.props.showMakeReport}>
            {t('reportViolation')}
          </button>
        </div>
        <div className="reportsBox">
          {reports.map(report => (
            <ReportCell report={report} resolveItem={this.props.resolveItem} key={report.id} />
          ))}
        </div>
      </div>
    )
  }
}

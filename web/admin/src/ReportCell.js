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

export default class ReportCell extends Component {
  render() {
    const { report } = this.props
    return (
      <div className="reportCellBox">
        {report.isAnom ? (
          <div className="cellTopBox">
            <p className="avatar">?</p>
            <p className="cellName">{t('anom')}</p>
            <span className="smallSpacer" />
            <p className="dateText">{new Date(report.dateCreate).toDateString()}</p>
          </div>
        ) : (
          <div className="cellTopBox">
            {report.reportPerson && <p className="avatar">{report.reportPerson.charAt(0)}</p>}
            {report.reportPerson && <p className="cellName1">{report.reportPerson} for </p>}
            {report.creator.image ? (
              <img className="avatar" src={report.creator.image} alt="avatar" />
            ) : (
              <p className="avatar">
                {report.creator.firstName.charAt(0) + report.creator.lastName.charAt(0)}
              </p>
            )}
            <p className="cellName">{`${report.creator.firstName} ${report.creator.lastName}`}</p>
            <span className="smallSpacer" />
            <p className="dateText">{new Date(report.dateCreate).toDateString()}</p>
          </div>
        )}
        <p className="cellDescription">{report.description}</p>
        <div className="floatRight">
          {report.status === 'Received' ? (
            <button onClick={() => this.props.resolveItem(report)} className="dd-bordered">
              {t('resolve')}
            </button>
          ) : (
            <button
              className="noBorderButtonBlue"
              onClick={() => this.props.viewResolution(report)}
            >
              {t('viewResolution')}
            </button>
          )}
        </div>
      </div>
    )
  }
}

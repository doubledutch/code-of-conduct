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

export default class AssignSection extends Component {
  constructor() {
    super()
    this.state = {}
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
              onClick={() => this.props.addNewCode({ history })}
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
          <div className="codeTable">
            {codesKeys.map(key => (
              <div className="codeRow">
                <p>{key}</p>
                <div className="flex" />
                <button
                  className="noBorderButtonBlue"
                  onClick={() => this.props.editCustomCode(key, { history })}
                >
                  {t('edit')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

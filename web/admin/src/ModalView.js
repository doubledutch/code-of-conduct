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
import Modal from 'react-modal'
import { TextInput } from '@doubledutch/react-components'
import { translate as t } from '@doubledutch/admin-client'
import Select from 'react-select'

export default class ModalView extends Component {
  constructor() {
    super()
    this.state = {
      resolution: '',
      resolutionPerson: '',
      reportPerson: '',
      report: '',
      isError: false,
      users: [],
      currentUser: {},
      search: '',
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        onRequestClose={this.props.closeModal}
        shouldCloseOnOverlayClick={false}
        contentLabel="Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        {this.renderModal()}
      </Modal>
    )
  }

  renderModal = () => {
    switch (this.props.modal) {
      case 'resolve':
        return this.renderResolveModal()
      case 'resolution':
        return this.renderViewResolution()
      case 'report':
        return this.renderReportModal()
      default:
        return this.renderResolveModal()
    }
  }

  closeModal = () => {
    this.setState({
      reportPerson: '',
      resolutionPerson: '',
      resolution: '',
      report: '',
      search: '',
      currentUser: {},
      isError: false,
    })
    this.props.closeModal()
  }

  renderViewResolution = () => {
    const { currentReport } = this.props
    return (
      <div>
        <div className="topModalBox">
          <h2 className="h2NoPadding">{t('resolutionDetails')}</h2>
          <div style={{ flex: 1 }} />
          <button className="closeButton" onClick={this.closeModal}>
            X
          </button>
        </div>
        <div className="centerModalBox">
          <p>{t('resolutionQ')}</p>
          <p>{currentReport.resolution}</p>
          <div className="verticalMargin" />
          <p>{t('resolutionPerson')}</p>
          <p>{currentReport.resolutionPerson}</p>
        </div>
        <div className="bottomModalBox">
          <button className="borderButton" onClick={this.closeModal}>
            {t('cancel')}
          </button>
          <button className="dd-bordered" onClick={this.closeModal}>
            {t('done')}
          </button>
        </div>
      </div>
    )
  }

  renderReportModal = () => {
    // const sample = { value: '', label: 'Select a User', className: 'dropdownText' }
    const users = this.state.search ? this.props.users : []
    const userName = this.state.currentUser.value ? this.state.currentUser : null
    return (
      <div>
        <div className="topModalBox">
          <h2 className="h2NoPadding">{t('reportViolation')}</h2>
          <div style={{ flex: 1 }} />
          <button className="closeButton" onClick={this.closeModal}>
            X
          </button>
        </div>
        <div className="centerModalBox">
          <TextInput
            multiline
            label="What happened"
            value={this.state.report}
            onChange={e => this.setState({ report: e.target.value, isError: false })}
            placeholder="Describe the incident"
            maxLength={250}
          />
          {this.state.isError && this.state.report.trim().length === 0 && (
            <p className="errorText">{t('fieldError')}</p>
          )}
          <div className="modalRow">
            <div>
              <TextInput
                label="Reporter"
                value={this.state.reportPerson}
                onChange={e => this.setState({ reportPerson: e.target.value, isError: false })}
                placeholder="Name"
                maxLength={50}
                className="titleText"
              />
              {this.state.isError && this.state.reportPerson.trim().length === 0 && (
                <p className="errorText">{t('nameError')}</p>
              )}
            </div>
            <div className="flexSpace" />
            <div className="selectBox">
              <p className="selectTitle">{t('behalf')}</p>
              <Select
                className="react-select"
                classNamePrefix="react-select"
                name="session"
                value={userName}
                onSelectResetsInput={false}
                onBlurResetsInput
                onChange={selected => this.setState({ currentUser: selected })}
                onInputChange={input => this.setState({ search: input })}
                clearable={false}
                noOptionsMessage={input => 'Please enter a name'}
                options={users}
                maxMenuHeight={50}
                disabled={false}
                placeholder="Select a User"
              />
              {this.state.isError && userName.value.length === 0 && (
                <p className="errorText">{t('userError')}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bottomModalBox">
          <button className="borderButton" onClick={this.closeModal}>
            {t('cancel')}
          </button>
          <button className="dd-bordered" onClick={this.completeReport}>
            {t('report')}
          </button>
        </div>
      </div>
    )
  }

  renderResolveModal = () => (
    <div>
      <div className="topModalBox">
        <h2 className="h2NoPadding">{t('resolutionDetails')}</h2>
        <div style={{ flex: 1 }} />
        <button className="closeButton" onClick={this.closeModal}>
          X
        </button>
      </div>
      <div className="centerModalBox">
        <TextInput
          multiline
          label="How was this incident resolved?"
          value={this.state.resolution}
          onChange={e => this.setState({ resolution: e.target.value, isError: false })}
          placeholder="Describe the resolution"
          maxLength={250}
        />
        {this.state.isError && this.state.resolution.trim().length === 0 && (
          <p className="errorText">{t('fieldError')}</p>
        )}
        <TextInput
          label="Who handled this resolution?"
          value={this.state.resolutionPerson}
          onChange={e => this.setState({ resolutionPerson: e.target.value, isError: false })}
          placeholder="Name"
          maxLength={50}
        />
        {this.state.isError && this.state.resolutionPerson.trim().length === 0 && (
          <p className="errorText">{t('fieldError')}</p>
        )}
      </div>
      <div className="bottomModalBox">
        <button className="borderButton" onClick={this.closeModal}>
          {t('cancel')}
        </button>
        <button className="dd-bordered" onClick={this.completeResolution}>
          {t('resolve')}
        </button>
      </div>
    </div>
  )

  completeResolution = () => {
    if (this.state.resolution.trim().length && this.state.resolutionPerson.trim().length) {
      this.props.completeResolution(
        this.state.resolution.trim(),
        this.state.resolutionPerson.trim(),
      )
      this.setState({ resolution: '', resolutionPerson: '' })
    } else {
      this.setState({ isError: true })
    }
  }

  completeReport = () => {
    if (
      this.state.report.trim().length &&
      this.state.reportPerson.trim().length &&
      this.state.currentUser.value
    ) {
      this.props.completeReport(
        this.state.report.trim(),
        this.state.reportPerson.trim(),
        this.state.currentUser.value,
      )
      this.setState({ report: '', reportPerson: '', currentUser: {} })
    } else {
      this.setState({ isError: true })
    }
  }
}

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
import client from '@doubledutch/admin-client'
import Modal  from 'react-modal'
import {TextInput} from '@doubledutch/react-components'
import Select from 'react-select';

export default class ModalView extends Component {
  constructor() {
    super()
    this.state = {
      resolution: "",
      resolutionPerson: "",
      reportPerson: "",
      report: "",
      isError: false,
      users: [],
      currentUser: {},
      search: ""
    }
  }

  render() {

    const {modal, currentReport} = this.props

    return (
      <Modal 
      isOpen={this.props.showModal}
      // onAfterOpen={this.makeFocus}
      onRequestClose={this.props.closeModal}
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
      case "resolution":
        return this.renderViewResolution()
      case "report":
        return this.renderReportModal()
      default:
        return this.renderResolveModal()
    }
  }

  renderViewResolution = () => {
    const {currentReport} = this.props
    return (
      <div>
        <div className="topModalBox">
          <h2 className="h2NoPadding">Resolution Details</h2>
          <div style={{flex:1}}/>
          <button className="closeButton" onClick={this.props.closeModal}>X</button>
        </div>
        <div className="centerModalBox">
          <p>How was this incident resolved?</p>
          <p>{currentReport.resolution}</p>
          <div className="verticalMargin"/>
          <p>Who handled this resolution?</p>
          <p>{currentReport.resolutionPerson}</p>
        </div>
        <div className="bottomModalBox">
          <button className="borderButton" onClick={this.props.closeModal}>Cancel</button>
          <button className="dd-bordered" onClick={this.props.closeModal}>Done</button>
        </div>
      </div>
    )
  }

  renderReportModal = () => {
    const sample = {value: "", label: "Select a User", className: "dropdownText"}
    const users = this.state.search ? this.props.users : []
    const userName = this.state.currentUser.value ? this.state.currentUser : sample
    return (
      <div>
        <div className="topModalBox">
          <h2 className="h2NoPadding">Resolution Details</h2>
          <div style={{flex:1}}/>
          <button className="closeButton" onClick={this.props.closeModal}>X</button>
        </div>
        <div className="centerModalBox">
          <TextInput multiline label="What happened"
            value={this.state.report}
            onChange={e => this.setState({report:e.target.value, isError: false})}
            placeholder="Describe the incident"
            maxLength={250}
          />
           {(this.state.isError && this.state.resolution.trim().length === 0) && <p className="errorText">*Please complete field</p>}
           <div className="modalRow">
            <div>
              <TextInput label="Reporter"
                value={this.state.reportPerson}
                onChange={e => this.setState({reportPerson :e.target.value, isError: false})}
                placeholder="Name"
                maxLength={50}
                className="titleText" />
                {(this.state.isError && this.state.resolutionPerson.trim().length === 0) && <p className="errorText">*Please enter a name</p>}
            </div>
            <div className="flexSpace"/>
            <div className="selectBox">
              <p className="selectTitle">Reporting on behalf of</p>
              <Select
                className="react-select" 
                classNamePrefix="react-select"
                name="session"
                value={userName}
                onSelectResetsInput={false}
                onBlurResetsInput={true}
                onChange={selected => this.setState({currentUser: selected})}
                onInputChange={input=>this.setState({search: input})}
                clearable={false}
                noOptionsMessage={input => "Please enter a name"}
                options={users}
                maxMenuHeight={50}
                disabled={false}
              />
              {(this.state.isError && userName.value.length === 0) && <p className="errorText">*Please select a user</p>}
            </div>
            </div>
        </div>
        <div className="bottomModalBox">
          <button className="borderButton" onClick={this.props.closeModal}>Cancel</button>
          <button className="dd-bordered" onClick={this.completeReport}>Resolve</button>
        </div>
      </div>
    )
  }

  renderResolveModal = () => {
    return (
      <div>
        <div className="topModalBox">
          <h2 className="h2NoPadding">Resolution Details</h2>
          <div style={{flex:1}}/>
          <button className="closeButton" onClick={this.props.closeModal}>X</button>
        </div>
        <div className="centerModalBox">
          <TextInput multiline label="How was this incident resolved?"
            value={this.state.resolution}
            onChange={e => this.setState({resolution:e.target.value, isError: false})}
            placeholder="Describe the resolution"
            maxLength={250}
            />
           {(this.state.isError && this.state.resolution.trim().length === 0) && <p className="errorText">*Please complete field</p>}
          <TextInput label="Who handled this resolution?"
            value={this.state.resolutionPerson}
            onChange={e => this.setState({resolutionPerson :e.target.value, isError: false})}
            placeholder="Name"
            maxLength={50}
            />
            {(this.state.isError && this.state.resolutionPerson.trim().length === 0) && <p className="errorText">*Please complete field</p>}
        </div>
        <div className="bottomModalBox">
          <button className="borderButton" onClick={this.props.closeModal}>Cancel</button>
          <button className="dd-bordered" onClick={this.completeResolution}>Resolve</button>
        </div>
      </div>
    )
  }

  completeResolution = () => {
    if (this.state.resolution.trim().length && this.state.resolutionPerson.trim().length) {
      this.props.completeResolution(this.state.resolution.trim(), this.state.resolutionPerson.trim())
    }
    else {
      this.setState({isError: true})
    }
  }

  completeReport = () => {
    if (this.state.report.trim().length && this.state.reportPerson.trim().length && this.state.currentUser.value) {
      this.props.completeReport(this.state.report.trim(), this.state.reportPerson.trim(), this.state.currentUser.value)
    }
    else {
      this.setState({isError: true})
    }
  }

}
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
import { AttendeeSelector } from '@doubledutch/react-components'

export default class AdminSection extends Component {
  constructor() {
    super()
    this.state = {
    }
  }


  render() {
    return (
      <div className="sectionContainer">
        <div className="containerRow">
          <h2 className="titleWithDescription">Trusted Persons</h2>
          <button className="displayButton" onClick={() => this.props.handleChange("isAdminBoxDisplay", !this.props.isAdminBoxDisplay)}>{(this.props.isAdminBoxDisplay ? "Hide Section" : "Show Section")}</button>
        </div>
        { this.props.isAdminBoxDisplay && <div className="attendeeBox">
          <p className="titleDescription">Trusted Persons are people that are able to listen and handle reported incidents. They should have training in this area and an image attached to their attendee profile to help attendees find them easily.</p>
          <AttendeeSelector client={client}
                    searchTitle="Select Trusted Persons"
                    selectedTitle="Current Trusted Persons"
                    onSelected={this.props.onAdminSelected}
                    onDeselected={this.props.onAdminDeselected}
                    selected={this.props.users.filter(a => this.isAdmin(a.id))} />
          </div> }
        </div>
    )
  }

  isAdmin(id) {
    return this.props.admins.find(a => a.id === id)
  }

}
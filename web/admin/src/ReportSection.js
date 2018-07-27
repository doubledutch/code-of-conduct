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
import { TextInput, AttendeeSelector } from '@doubledutch/react-components'

export default class ReportSection extends Component {
  constructor() {
    super()
    this.state = {
      // admins: [],
      // input: "",
      // clickable:true
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({input: nextProps.codeOfConductDraft.text})
  // }


  render() {
    console.log(this.props.reports)
    return (
      <div className="sectionContainer">
        <div className="containerRow">
          <h2 className="titleWithDescription">Reported Violations</h2>
          <button className="displayButton" onClick={() => this.props.handleChange("isReportsBoxDisplay", !this.props.isReportsBoxDisplay)}>{(this.props.isReportsBoxDisplay ? "Hide Section" : "View Section")}</button>
        </div>
        { this.props.isReportsBoxDisplay && <div className="reportsBox">
          <div>
            {this.props.reports.map(item =>{
              return (
                <p>{item.description}</p>
              )
            })}
          </div>

          </div> }
        </div>
    )
  }

 

}
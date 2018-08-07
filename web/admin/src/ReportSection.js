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
import {CSVLink} from 'react-csv'
import LeftReport from "./LeftReport"
import RightReport from "./RightReport"

export default class ReportSection extends Component {
  constructor() {
    super()
    this.state = {
      // admins: [],
      // input: "",
      // clickable:true
    }
  }

  render() {
    const reports = Object.values(this.props.reports)
    const newReports = reports.filter(report => report.status === "Received").sort((a,b) => b.dateCreate - a.dateCreate)
    const resolvedReports = reports.filter(report => report.status !== "Received").sort((a,b) => b.dateCreate - a.dateCreate)
    return (
      <div className="sectionContainerSpace">
        <div className="containerRow">
          <h2 className="titleWithDescription">Reported Violations</h2>
          <button className="displayButton" onClick={() => this.props.handleChange("isReportsBoxDisplay", !this.props.isReportsBoxDisplay)}>{(this.props.isReportsBoxDisplay ? "Hide Section" : "Show Section")}</button>
        </div>
        { this.props.isReportsBoxDisplay && <div className="reportsContainer">
          <LeftReport reports = {newReports} resolveItem={this.props.resolveItem} showMakeReport={this.props.showMakeReport}/>
          <span className="largeSpacer"/>
          <RightReport reports = {resolvedReports} viewResolution={this.props.viewResolution}/>
          </div> 
        }
          <CSVLink className="csvButton" data={this.parseData(reports)} filename={"questions.csv"}>Export list</CSVLink>
        </div>
    )
  }

  parseData = (reports) => {
    let parsedReports = []
    reports.map(report => {
      let item = {}
      item.dateCreated = new Date(report.dateCreate).toDateString()
      item.user = report.isAnom ? "anonymous" : report.creator.firstName + " " + report.creator.lastName
      item.description = report.description
      item.status = report.status
      item.reportMadeBy = report.reportPerson || item.user
      item.resolution = report.resolution
      item.resolutionBy = report.resolutionPerson
      parsedReports.push({...item})
    })
    return parsedReports
  }

}
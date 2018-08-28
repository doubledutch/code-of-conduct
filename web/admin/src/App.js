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
import '@doubledutch/react-components/lib/base.css'
import './App.css'
import client from '@doubledutch/admin-client'
import md5 from 'md5'
import FirebaseConnector, {
  mapPerUserPrivateAdminablePushedDataToStateObjects,
} from '@doubledutch/firebase-connector'
import CodeSection from "./CodeSection"
import AdminSection from "./AdminSection"
import ReportSection from "./ReportSection"
import ModalView from "./ModalView"
const fbc = FirebaseConnector(client, 'codeofconduct')

fbc.initializeAppWithSimpleBackend()

export default class App extends Component {
  constructor() {
    super()
    this.state = { 
      allUsers: [],
      admins: [],
      isCodeBoxDisplay: true,
      isAdminBoxDisplay: true,
      isReportsBoxDisplay: true,
      codeOfConduct: {},
      codeOfConductDraft: {},
      reports: [],
      showModal: false,
      modal: "resolve",
      currentReport: {},
      dropDownUsers: []
    }
    this.signin = fbc.signinAdmin()
    .then(user => this.user = user)
    .catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      client.getUsers().then(users => {
        let dropDownUsers = []
        users.forEach(user => dropDownUsers.push(Object.assign({}, {value: user.id, label: user.firstName + " " + user.lastName, className: "dropdownText"})))
        this.setState({allUsers: users, isSignedIn: true, dropDownUsers})
        const codeOfConductRef = fbc.database.public.adminRef('codeOfConduct')
        const codeOfConductDraftRef = fbc.database.public.adminRef('codeOfConductDraft')  
        const adminsRef = fbc.database.public.adminRef("admins")
        mapPerUserPrivateAdminablePushedDataToStateObjects(fbc, 'reports', this, 'reports', (userId, key, value) => key)

        codeOfConductRef.on('value', data => {
          const codeOfConduct = data.val() || {}
          this.setState({ codeOfConduct })
        })

        codeOfConductDraftRef.on('value', data => { 
          const codeOfConductDraft = data.val() || {}
          this.setState({ codeOfConductDraft })
        })

        adminsRef.on('child_added', data => {
          this.setState({ admins: [...this.state.admins, {...data.val(), key: data.key }] })
        })

        adminsRef.on('child_removed', data => {
          this.setState({ admins: this.state.admins.filter(x => x.key !== data.key) })
        })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <ModalView modal={this.state.modal} showModal={this.state.showModal} closeModal={this.closeModal} currentReport={this.state.currentReport} completeResolution={this.completeResolution} users={this.state.dropDownUsers} completeReport={this.completeReport}/>
        <CodeSection handleChange={this.handleChange} isCodeBoxDisplay={this.state.isCodeBoxDisplay} codeOfConduct={this.state.codeOfConduct} codeOfConductDraft={this.state.codeOfConductDraft} saveCodeOfConduct={this.saveCodeOfConduct} saveDraftCodeOfConduct={this.saveDraftCodeOfConduct}/>
        <AdminSection handleChange={this.handleChange} isAdminBoxDisplay={this.state.isAdminBoxDisplay} admins={this.state.admins} users={this.state.allUsers} onAdminSelected={this.onAdminSelected} onAdminDeselected={this.onAdminDeselected}/>
        <ReportSection handleChange={this.handleChange} showMakeReport={this.showMakeReport} isReportsBoxDisplay={this.state.isReportsBoxDisplay} reports={this.state.reports} resolveItem={this.resolveItem} viewResolution={this.viewResolution}/>
      </div>
    )
  }

  onAdminSelected = attendee => {
    fbc.database.public.adminRef("admins").push(attendee)
  }

  onAdminDeselected = attendee => {
    const newAttendee = this.state.admins.find(a => a.id === attendee.id)
    if (newAttendee.key) fbc.database.public.adminRef("admins").child(newAttendee.key).remove()
  }

  handleChange = (name, value) => {
    this.setState({[name]: value});
  }

  saveCodeOfConduct = (input) => {
    if (window.confirm('Are you sure you want to publish the code of conduct? Attendees will have to confirm acceptance of the new code of conduct.')) {
      const publishTime = new Date().getTime()
      fbc.database.public.adminRef('codeOfConduct').set({text: input, publishTime}).then(() => {
        updateLandingUrls(input)
      })
      this.saveDraftCodeOfConduct(input)
    }
  }

  resolveItem = (item) => {
    this.setState({currentReport: item, showModal: true, modal:"resolve"})
  }
  viewResolution = (item) => {
    this.setState({currentReport: item, showModal: true, modal:"resolution"})
  }

  showMakeReport = () => {
    this.setState({showModal: true, modal:"report"})
  }
  completeResolution = (resolution, resolutionPerson) => {
    fbc.database.private.adminableUsersRef(this.state.currentReport.userId).child('reports').child(this.state.currentReport.id).update({status: "Resolved", resolution, resolutionPerson, dateCreate: new Date().getTime()})
    this.setState({currentReport: {}, showModal: false})
  }

  completeReport = (report, reportPerson, userID) => {
    const behalfUser = this.state.allUsers.find(user => user.id === userID)
    const newReport =  Object.assign({}, blankReport)
    newReport.description = report
    newReport.dateCreate = new Date().getTime()
    newReport.creator = behalfUser
    newReport.reportPerson = reportPerson
    fbc.database.private.adminableUsersRef(userID).child('reports').push(newReport)
    .then(() => this.setState({showModal: false}))
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  saveDraftCodeOfConduct = (input) => {
      const publishTime = new Date().getTime()
      fbc.database.public.adminRef('codeOfConductDraft').set({"text": input, publishTime})
  }
}

function updateLandingUrls(codeOfConductText) {
  const url = `dd://extensions/codeofconduct?version=${md5(codeOfConductText)}`

  client.cmsRequest('GET', '/api/config').then(config => {
    if (!config) return
    // Update the LandingUrls setting. The checksum of the code of conduct ensures
    // that attendees will have to re-accept.

    const settings = [].concat(...config.Configuration.Groups.map(g => g.Settings))
    const landingUrlsSetting = settings.find(s => s.Name === 'LandingUrls')
    if (landingUrlsSetting && landingUrlsSetting.Value) {
      let landingUrls = []
      try {
        landingUrls = JSON.parse(landingUrlsSetting.Value).filter(url => url.startsWith)
        if (!landingUrls.length) landingUrls = []
      } catch (e) {
        // Default to starting with an empty list.
      }

      const existingIndex = landingUrls.findIndex(url => url.startsWith('dd://extensions/codeofconduct'))
      if (existingIndex >= 0) {
        landingUrls[existingIndex] = url
      } else {
        landingUrls.push(url)
      }

      const newValue = JSON.stringify(landingUrls)
      console.log(`Updating LandingUrls from ${landingUrlsSetting.Value} to ${newValue}`)
      landingUrlsSetting.Value = newValue
      client.cmsRequest('PUT', '/api/config', config)
    }
  })
}

const blankReport = {
  isAnom: false,
  creator: client.currentUser,
  preferredContact: "",
  description: "",
  status: "Received"
}

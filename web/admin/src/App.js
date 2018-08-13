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
import FirebaseConnector from '@doubledutch/firebase-connector'
import {
  mapPerPrivateAdminableushedDataToStateObjects,
  mapPerUserPublicPushedDataToStateObjects,
  mapPerUserPrivateAdminablePushedDataToStateObjects,
  mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects
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
      // const userStatusRef = fbc.database.private.adminableUserRef('status')
      const adminsRef = fbc.database.public.adminRef("admins")
      const userReportsRef = fbc.database.private.adminableUsersRef()
      mapPerUserPrivateAdminablePushedDataToStateObjects(fbc, 'reports', this, 'reports', (userId, key, value) => key)

      codeOfConductRef.on('child_added', data => { 
        this.setState({ codeOfConduct: {...data.val(), key: data.key } })
      })

      codeOfConductRef.on('child_changed', data => {
        this.setState({ codeOfConduct: {...data.val(), key: data.key } })
      })

      adminsRef.on('child_added', data => {
        this.setState({ admins: [...this.state.admins, {...data.val(), key: data.key }] })
      })

      adminsRef.on('child_removed', data => {
        this.setState({ admins: this.state.admins.filter(x => x.key !== data.key) })
      })

      codeOfConductDraftRef.on('child_added', data => {
        this.setState({ codeOfConductDraft: {...data.val(), key: data.key } })
      })

      codeOfConductDraftRef.on('child_changed', data => {
        this.setState({ codeOfConductDraft: {...data.val(), key: data.key } })
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
    //On initial launching of the app this fbc object would not exist. In that case the default is to be on. On first action we would set the object to the expected state and from there use update.
    if (window.confirm("Are you sure you want to publish the code of conduct?")) {
      if (Object.keys(this.state.codeOfConduct).length === 0) {
        const publishTime = new Date().getTime()
        fbc.database.public.adminRef('codeOfConduct').push({"text": input, publishTime})
        this.saveDraftCodeOfConduct(input)
      }
      else {
        const publishTime = new Date().getTime()
        fbc.database.public.adminRef('codeOfConduct').child(this.state.codeOfConduct.key).update({"text": input, publishTime})
        this.saveDraftCodeOfConduct(input)
      }
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
    //On initial launching of the app this fbc object would not exist. In that case the default is to be on. On first action we would set the object to the expected state and from there use update.
    if (Object.keys(this.state.codeOfConductDraft).length === 0) {
      const publishTime = new Date().getTime()
      fbc.database.public.adminRef('codeOfConductDraft').push({"text": input, publishTime})
    }
    else {
      const publishTime = new Date().getTime()
      fbc.database.public.adminRef('codeOfConductDraft').child(this.state.codeOfConductDraft.key).update({"text": input, publishTime})
    }
  }

}

const blankReport = {
  isAnom: false,
  creator: client.currentUser,
  preferredContact: "",
  description: "",
  status: "Received"
}

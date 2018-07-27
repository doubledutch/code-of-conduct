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
import {CSVLink} from 'react-csv'
import client from '@doubledutch/admin-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import CodeSection from "./CodeSection"
import AdminSection from "./AdminSection"
import ReportSection from "./ReportSection"
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
      reports: []
    }
    this.signin = fbc.signinAdmin()
    .then(user => this.user = user)
    .catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      client.getUsers().then(users => {
      this.setState({allUsers: users, isSignedIn: true})
      const codeOfConductRef = fbc.database.public.adminRef('codeOfConduct')
      const codeOfConductDraftRef = fbc.database.public.adminRef('codeOfConductDraft')  
      const userStatusRef = fbc.database.private.adminableUserRef('status')
      const adminsRef = fbc.database.public.adminRef("admins")
      const userReportsRef = fbc.database.private.adminableUsersRef('report')

      userReportsRef.on('child_added', data => {
        this.setState({ reports: [...this.state.reports, {...data.val(), key: data.key }]})
      })

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

      userStatusRef.on('child_added', data => {
        let showPage = "home"
        if (Object.values(data.val()).accepted) showPage="app"
        this.setState({ userStatus: {...data.val(), key: data.key }, currentPage: showPage })
      })
      
    })
    })
  }

  render() {
    return (
      <div className="App">
        <CodeSection handleChange={this.handleChange} isCodeBoxDisplay={this.state.isCodeBoxDisplay} codeOfConduct={this.state.codeOfConduct} codeOfConductDraft={this.state.codeOfConductDraft} saveCodeOfConduct={this.saveCodeOfConduct} saveDraftCodeOfConduct={this.saveDraftCodeOfConduct}/>
        <AdminSection handleChange={this.handleChange} isAdminBoxDisplay={this.state.isAdminBoxDisplay} admins={this.state.admins} users={this.state.allUsers} onAdminSelected={this.onAdminSelected} onAdminDeselected={this.onAdminDeselected}/>
        <ReportSection handleChange={this.handleChange} isReportsBoxDisplay={this.state.isReportsBoxDisplay} reports={this.state.reports}/>
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
    if (Object.keys(this.state.codeOfConduct).length === 0) {
      fbc.database.public.adminRef('codeOfConduct').push({"text": input})
      this.saveDraftCodeOfConduct(input)
    }
    else {
      fbc.database.public.adminRef('codeOfConduct').child(this.state.codeOfConduct.key).update({"text": input})
      this.saveDraftCodeOfConduct(input)
    }
  }

  saveDraftCodeOfConduct = (input) => {
    //On initial launching of the app this fbc object would not exist. In that case the default is to be on. On first action we would set the object to the expected state and from there use update.
    if (Object.keys(this.state.codeOfConductDraft).length === 0) {
      fbc.database.public.adminRef('codeOfConductDraft').push({"text": input})
    }
    else {
      fbc.database.public.adminRef('codeOfConductDraft').child(this.state.codeOfConductDraft.key).update({"text": input})
    }
  }

}

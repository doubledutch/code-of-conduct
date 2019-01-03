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

import React, { PureComponent } from 'react'
import '@doubledutch/react-components/lib/base.css'
import './App.css'
import client, { translate as t, useStrings } from '@doubledutch/admin-client'
import md5 from 'md5'
import { HashRouter as Router, Redirect, Route } from 'react-router-dom'
import {
  provideFirebaseConnectorToReactComponent,
  mapPerUserPrivateAdminablePushedDataToStateObjects,
} from '@doubledutch/firebase-connector'
import i18n from './i18n'
import CustomCodeSection from './CustomCodeSection'
import CodeSection from './CodeSection'
import AdminSection from './AdminSection'
import ReportSection from './ReportSection'
import ModalView from './ModalView'
import AssignSection from './AssignSection'

useStrings(i18n)

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      allUsers: [],
      admins: [],
      isAssignBoxDisplay: true,
      isCodeBoxDisplay: true,
      isAdminBoxDisplay: true,
      isReportsBoxDisplay: true,
      codeOfConduct: {},
      codeOfConductDraft: {},
      reports: [],
      customCodes: {},
      customCodesDraft: {},
      selectedCodeOfConduct: {},
      selectedCodeOfConductDraft: {},
      selectedKey: '',
      status: [],
      showModal: false,
      modal: 'resolve',
      currentReport: {},
      dropDownUsers: [],
      perUserInfo: {},
    }
    this.signin = props.fbc
      .signinAdmin()
      .then(user => (this.user = user))
      .catch(err => console.error(err))
  }

  componentDidMount() {
    const { fbc } = this.props
    this.signin.then(() => {
      client.getAttendees().then(users => {
        const dropDownUsers = []
        users.forEach(user =>
          dropDownUsers.push(
            Object.assign(
              {},
              {
                value: user.id,
                label: `${user.firstName} ${user.lastName}`,
                className: 'dropdownText',
              },
            ),
          ),
        )
        this.setState({ allUsers: users, isSignedIn: true, dropDownUsers })
        const codeOfConductRef = fbc.database.public.adminRef('codeOfConduct')
        const codeOfConductDraftRef = fbc.database.public.adminRef('codeOfConductDraft')
        const adminsRef = fbc.database.public.adminRef('admins')
        const customCodeRef = this.props.fbc.database.public.adminRef('customCodeOfConduct')
        const customCodeDraftRef = this.props.fbc.database.public.adminRef(
          'customCodeOfConductDraft',
        )
        const customRef = fbc.database.private.adminableUsersRef()
        mapPerUserPrivateAdminablePushedDataToStateObjects(
          fbc,
          'reports',
          this,
          'reports',
          (userId, key, value) => key,
        )

        mapPerUserPrivateAdminablePushedDataToStateObjects(
          fbc,
          'status',
          this,
          'status',
          (userId, key, value) => key,
        )

        customRef.on('value', data => {
          this.setState({ perUserInfo: data.val() })
        })

        client.getTiers().then(tiers => this.setState({ tiers }))
        client.getAttendeeGroups().then(groups => this.setState({ groups }))

        customCodeRef.on('value', data => {
          this.setState({ customCodes: data.val() || {} })
        })

        customCodeDraftRef.on('value', data => {
          this.setState({ customCodesDraft: data.val() || {} })
        })

        codeOfConductRef.on('value', data => {
          const codeOfConduct = data.val() || {}
          this.setState({ codeOfConduct })
        })

        codeOfConductDraftRef.on('value', data => {
          const codeOfConductDraft = data.val() || {}
          this.setState({ codeOfConductDraft })
        })

        adminsRef.on('child_added', data => {
          this.setState({ admins: [...this.state.admins, { ...data.val(), key: data.key }] })
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
        <Router>
          <div>
            <Route
              exact
              path="/"
              render={({ history }) => (
                <div>
                  <ModalView
                    modal={this.state.modal}
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                    currentReport={this.state.currentReport}
                    completeResolution={this.completeResolution}
                    users={this.state.dropDownUsers}
                    completeReport={this.completeReport}
                  />
                  <CodeSection
                    handleChange={this.handleChange}
                    isCodeBoxDisplay={this.state.isCodeBoxDisplay}
                    codeOfConduct={this.state.codeOfConduct}
                    codeOfConductDraft={this.state.codeOfConductDraft}
                    saveCodeOfConduct={this.saveCodeOfConduct}
                    saveDraftCodeOfConduct={this.saveDraftCodeOfConduct}
                  />
                  <AssignSection
                    handleChange={this.handleChange}
                    isAssignBoxDisplay={this.state.isAssignBoxDisplay}
                    addNewCode={this.addNewCode}
                    history={history}
                    codes={this.state.customCodesDraft}
                    codesPublished={this.state.customCodes}
                    editCustomCode={this.editCustomCode}
                    status={this.state.status}
                    client={client}
                  />
                  <AdminSection
                    handleChange={this.handleChange}
                    isAdminBoxDisplay={this.state.isAdminBoxDisplay}
                    admins={this.state.admins}
                    users={this.state.allUsers}
                    onAdminSelected={this.onAdminSelected}
                    onAdminDeselected={this.onAdminDeselected}
                  />
                  <ReportSection
                    handleChange={this.handleChange}
                    showMakeReport={this.showMakeReport}
                    isReportsBoxDisplay={this.state.isReportsBoxDisplay}
                    reports={this.state.reports}
                    resolveItem={this.resolveItem}
                    viewResolution={this.viewResolution}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/content/"
              render={({ history }) => (
                <div>
                  <CustomCodeSection
                    handleChange={this.handleChange}
                    isCodeBoxDisplay={this.state.isCodeBoxDisplay}
                    selectedCodeOfConduct={this.state.selectedCodeOfConduct}
                    selectedCodeOfConductDraft={this.state.selectedCodeOfConductDraft}
                    saveCustomCodeOfConduct={this.saveCustomCodeOfConduct}
                    saveDraftCustomCodeOfConduct={this.saveDraftCustomCodeOfConduct}
                    deleteCustomCodeOfConduct={this.deleteCustomCodeOfConduct}
                    getAttendees={this.getAttendees}
                    allUsers={this.state.allUsers}
                    history={history}
                    title={this.state.selectedKey}
                    fbc={this.props.fbc}
                    perUserInfo={this.state.perUserInfo}
                    backAction={this.backAction}
                    customCodes={this.state.customCodesDraft}
                  />
                </div>
              )}
            />
          </div>
        </Router>
      </div>
    )
  }

  onAdminSelected = attendee => {
    this.props.fbc.database.public.adminRef('admins').push(attendee)
  }

  onAdminDeselected = attendee => {
    const newAttendee = this.state.admins.find(a => a.id === attendee.id)
    if (newAttendee.key)
      this.props.fbc.database.public
        .adminRef('admins')
        .child(newAttendee.key)
        .remove()
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value })
  }

  deleteCustomCodeOfConduct = (key, history) => {
    if (window.confirm(t('deleteConfirm'))) {
      const data = this.state.customCodesDraft[key]
      if (data) {
        if (data.users) {
          data.users.forEach(user => {
            this.props.fbc.database.private
              .adminableUsersRef(user.id)
              .child('customCode')
              .remove()
          })
        }
        this.props.fbc.database.public
          .adminRef('customCodeOfConductDraft')
          .child(key)
          .remove()
        this.props.fbc.database.public
          .adminRef('customCodeOfConduct')
          .child(key)
          .remove()
      }
      history.push(`/`)
      this.setState({ selectedCodeOfConduct: {}, selectedCodeOfConductDraft: {}, selectedKey: '' })
    }
  }

  saveCodeOfConduct = input => {
    if (window.confirm(t('publishConfirm'))) {
      const publishTime = new Date().getTime()
      this.props.fbc.database.public
        .adminRef('codeOfConduct')
        .set({ text: input, publishTime })
        .then(() => {
          updateLandingUrls(input)
        })
      this.saveDraftCodeOfConduct(input)
    }
  }

  saveCustomCodeOfConduct = (input, title, users, history, question) => {
    if (window.confirm(t('publishConfirm'))) {
      const publishTime = new Date().getTime()
      this.props.fbc.database.public
        .adminRef('customCodeOfConduct')
        .child(title)
        .set({ text: input, publishTime, users, question })
      this.saveDraftCustomCodeOfConduct(input, title, users, question, history)
    }
    if (this.state.selectedKey && this.state.selectedKey !== title) {
      this.props.fbc.database.public
        .adminRef('customCodeOfConduct')
        .child(this.state.selectedKey)
        .remove()
    }
  }

  saveDraftCodeOfConduct = input => {
    const publishTime = new Date().getTime()
    this.props.fbc.database.public.adminRef('codeOfConductDraft').set({ text: input, publishTime })
  }

  saveDraftCustomCodeOfConduct = (input, title, users, question, history) => {
    const publishTime = new Date().getTime()
    this.props.fbc.database.public
      .adminRef('customCodeOfConductDraft')
      .child(title)
      .set({ text: input, publishTime, users, question })
    if (this.state.selectedKey && this.state.selectedKey !== title) {
      this.props.fbc.database.public
        .adminRef('customCodeOfConductDraft')
        .child(this.state.selectedKey)
        .remove()
    }
    this.setState({ selectedCodeOfConduct: {}, selectedCodeOfConductDraft: {}, selectedKey: '' })
    history.push(`/`)
  }

  editCustomCode = (key, history) => {
    this.setState({
      selectedCodeOfConduct: this.state.customCodes[key],
      selectedCodeOfConductDraft: this.state.customCodesDraft[key],
      selectedKey: key,
    })
    history.push(`/content`)
  }

  getAttendees = query => client.getAttendees(query)

  resolveItem = item => {
    this.setState({ currentReport: item, showModal: true, modal: 'resolve' })
  }

  viewResolution = item => {
    this.setState({ currentReport: item, showModal: true, modal: 'resolution' })
  }

  showMakeReport = () => {
    this.setState({ showModal: true, modal: 'report' })
  }

  completeResolution = (resolution, resolutionPerson) => {
    this.props.fbc.database.private
      .adminableUsersRef(this.state.currentReport.userId)
      .child('reports')
      .child(this.state.currentReport.id)
      .update({
        status: 'Resolved',
        resolution,
        resolutionPerson,
        dateCreate: new Date().getTime(),
      })
    this.setState({ currentReport: {}, showModal: false })
  }

  completeReport = (report, reportPerson, userID) => {
    const behalfUser = this.state.allUsers.find(user => user.id === userID)
    const newReport = Object.assign({}, blankReport)
    newReport.description = report
    newReport.dateCreate = new Date().getTime()
    newReport.creator = behalfUser
    newReport.reportPerson = reportPerson
    this.props.fbc.database.private
      .adminableUsersRef(userID)
      .child('reports')
      .push(newReport)
      .then(() => this.setState({ showModal: false }))
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  addNewCode = history => {
    history.push(`/content`)
  }

  backAction = history => {
    history.push(`/`)
    this.setState({ selectedCodeOfConduct: {}, selectedCodeOfConductDraft: {}, selectedKey: '' })
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
    if (landingUrlsSetting) {
      let landingUrls = []
      try {
        landingUrls = JSON.parse(landingUrlsSetting.Value).filter(url => url.startsWith)
        if (!landingUrls.length) landingUrls = []
      } catch (e) {
        // Default to starting with an empty list.
      }

      const existingIndex = landingUrls.findIndex(url =>
        url.startsWith('dd://extensions/codeofconduct'),
      )
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

export default provideFirebaseConnectorToReactComponent(
  client,
  'codeofconduct',
  (props, fbc) => <App {...props} fbc={fbc} />,
  PureComponent,
)

const blankReport = {
  isAnom: false,
  preferredContact: '',
  description: '',
  status: 'Received',
}

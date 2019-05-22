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
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

// rn-client must be imported before FirebaseConnector
import client, { TitleBar, translate as t, useStrings } from '@doubledutch/rn-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import AcceptView from './AcceptView'
import i18n from './i18n'
import AppView from './AppView'
import LoadingView from './LoadingView'

useStrings(i18n)

class HomeView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      codeOfConduct: null,
      customCodeOfConduct: null,
      reports: [],
      currentReport: {},
      currentAppPage: 'home',
      admins: [],
      isLoggedIn: false,
      logInFailed: false,
      version: 'default',
    }

    this.signin = props.fbc.signin().then(user => (this.user = user))
    this.signin.catch(err => this.errorLoading())
  }

  componentDidMount() {
    const { fbc } = this.props
    client.getCurrentEvent().then(currentEvent => this.setState({ currentEvent }))
    client.getPrimaryColor().then(primaryColor => this.setState({ primaryColor }))
    client.getCurrentUser().then(currentUser => {
      this.setState({ currentUser })
      this.signin
        .then(() => {
          const codeOfConductRef = fbc.database.public.adminRef('codeOfConduct')
          const customCodeRef = fbc.database.private.adminableUserRef('customCode')
          const userReportsRef = fbc.database.private.adminableUserRef('reports')
          const adminsRef = fbc.database.public.adminRef('admins')
          const wireListeners = () => {
            customCodeRef.on('value', data => {
              if (data.val()) {
                this.setState({ version: data.val() })
                fbc.database.public
                  .adminRef('customCodeOfConduct')
                  .child(data.val())
                  .once('value', data => {
                    const customCodeOfConduct = data.val() || null
                    this.setState({ customCodeOfConduct })
                  })
              } else {
                this.setState({ customCodeOfConduct: null })
              }
              // ensure custom code of conducts are received first
              codeOfConductRef.on('value', data => {
                const codeOfConduct = data.val() || {}
                const isCodeOfConductEmpty = codeOfConduct.text ? !codeOfConduct.text.trim() : true
                this.setState({ codeOfConduct })
                if (this.props.version && isCodeOfConductEmpty){
                  this.clearTimer()
                  client.dismissLandingPage(false)
                }
                // The function below will hide the login screen component with a 1/5 second delay to provide an oppt for firebase data to download
                this.hideLogInScreen = setTimeout(() => {
                  this.setState({ isLoggedIn: true })
                }, 200)
              })
            })

            adminsRef.on('child_added', data => {
              this.setState({ admins: [...this.state.admins, { ...data.val(), key: data.key }] })
            })

            adminsRef.on('child_removed', data => {
              this.setState({ admins: this.state.admins.filter(x => x.key !== data.key) })
            })
            userReportsRef.on('child_added', data => {
              this.setState({ reports: [...this.state.reports, { ...data.val(), key: data.key }] })
            })

            userReportsRef.on('child_changed', data => {
              this.setState(prevState => ({
                reports: prevState.reports.map(r =>
                  r.key === data.key ? { ...data.val(), key: data.key } : r,
                ),
              }))
            })
          }
          wireListeners()
        })
    })
    .catch(() => {
      this.errorLoading()
    })
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer = () => {
    if (this.hideLogInScreen) {
      clearTimeout(this.hideLogInScreen)
    }
  }

  errorLoading = () => {
    //Since this app can launch as a custom landing page we need different actions upon an error loading
    if (this.props.version){
      client.openURL('dd://leaveevent')
    }
    else {
      this.setState({ logInFailed: true })
    }
  }

  render() {
    const { currentEvent, currentUser, primaryColor } = this.state
    const { suggestedTitle } = this.props
    if (!currentEvent || !currentUser || !primaryColor) return null
    return (
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.select({ ios: 'padding', android: null })}
      >
        {this.props.version ? null : (
          <TitleBar title={suggestedTitle || t('title')} client={client} signin={this.signin} />
        )}
        {this.state.isLoggedIn ? (
          this.renderPage()
        ) : (
          <LoadingView LogInFailed={this.state.LogInFailed} />
        )}
      </KeyboardAvoidingView>
    )
  }

  renderPage = () => {
    
    if (this.props.version) {
      return (
        <AcceptView
          codeOfConduct={this.state.codeOfConduct}
          customCodeOfConduct={this.state.customCodeOfConduct}
          markAccepted={this.markAccepted}
          markAcceptedCustom={this.markAcceptedCustom}
          currentEvent={this.state.currentEvent}
          primaryColor={this.state.primaryColor}
        />
      )
    }

    return (
      <AppView
        admins={this.state.admins}
        currentAppPage={this.state.currentAppPage}
        showReport={this.showReport}
        showCodeOfConduct={this.showCodeOfConduct}
        showModal={this.showModal}
        codeOfConduct={this.state.codeOfConduct}
        customCodeOfConduct={this.state.customCodeOfConduct}
        makeNewReport={this.makeNewReport}
        reports={this.state.reports}
        currentReport={this.state.currentReport}
        saveReport={this.saveReport}
        updateItem={this.updateItem}
        primaryColor={this.state.primaryColor}
        currentUser={this.state.currentUser}
      />
    )
  }

  updateItem = (variable, input) => {
    const updatedItem = Object.assign({}, this.state.currentReport)
    updatedItem[variable] = input
    this.setState({ currentReport: updatedItem })
  }

  markAccepted = () => {
    const { version } = this.props
    this.props.fbc.database.private
      .adminableUserRef('status')
      .child(version)
      .set({
        accepted: true,
      })
      .catch(x => console.error(x))
      .then(() => client.dismissLandingPage(true))
  }

  markAcceptedCustom = response => {
    const { version } = this.state
    this.props.fbc.database.private
      .adminableUserRef('status')
      .child(version)
      .set({
        accepted: true,
        questionResponse: response || 'N/A',
      })
      .catch(x => console.error(x))
      .then(() => client.dismissLandingPage(true))
  }

  showModal = () => {
    const newReport = Object.assign({}, this.blankReport())
    const current = this.state.currentAppPage
    let switchPage = 'modal'
    if (current === 'modal') switchPage = 'home'
    this.setState({ currentReport: newReport, currentAppPage: switchPage })
  }

  showCodeOfConduct = () => {
    const current = this.state.currentAppPage
    let switchPage = 'code'
    if (current === 'code') switchPage = 'home'
    this.setState({ currentAppPage: switchPage })
  }

  showReport = report => {
    let currentReport = report
    const current = this.state.currentAppPage
    let switchPage = 'report'
    if (current === 'report') {
      switchPage = 'home'
      currentReport = Object.assign({}, this.blankReport())
    }
    this.setState({ currentAppPage: switchPage, currentReport })
  }

  saveReport = () => {
    const newReport = Object.assign({}, this.blankReport())
    const newItem = this.state.currentReport
    newItem.description = newItem.description.trim()
    newItem.dateCreate = new Date().getTime()
    this.props.fbc.database.private
      .adminableUserRef('reports')
      .push(newItem)
      .then(() => this.setState({ currentAppPage: 'home', currentReport: newReport }))
      .catch(x => console.error(x))
  }

  blankReport = () => ({
    isAnom: false,
    creator: this.state.currentUser,
    preferredContact: '',
    description: '',
    status: 'Received',
  })
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'codeofconduct',
  (props, fbc) => <HomeView {...props} fbc={fbc} />,
  PureComponent,
)

const fontSize = 18
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  scroll: {
    flex: 1,
    padding: 15,
  },
  task: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkmark: {
    textAlign: 'center',
    fontSize,
  },
  creatorAvatar: {
    marginRight: 4,
  },
  creatorEmoji: {
    marginRight: 4,
    fontSize,
  },
  taskText: {
    fontSize,
    flex: 1,
  },
  compose: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
  },
  sendButtons: {
    justifyContent: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    margin: 5,
  },
  sendButtonText: {
    fontSize: 20,
    color: 'gray',
  },
  composeText: {
    flex: 1,
  },
})

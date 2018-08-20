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
import ReactNative, {
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView
} from 'react-native'

// rn-client must be imported before FirebaseConnector
import client, { Avatar, TitleBar } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import AcceptView from "./AcceptView"
import AppView from "./AppView"
import ReportsSubView from './ReportsSubView';
import LoadingView from "./LoadingView"
const fbc = FirebaseConnector(client, 'codeofconduct')

fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()
    this.state = {
      currentPage: "home", 
      codeOfConduct: null,
      reports: [],
      currentReport: {},
      userStatus: {},
      currentAppPage: "home",
      admins: [],
      isLoggedIn: false,
      logInFailed: false
    }

    this.signin = fbc.signin()
      .then(user => this.user = user)
    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      const codeOfConductRef = fbc.database.public.adminRef('codeOfConduct')
      const userStatusRef = fbc.database.private.adminableUserRef('status')
      const userReportsRef = fbc.database.private.adminableUserRef('reports')
      const adminsRef = fbc.database.public.adminRef("admins")
      const wireListeners = () => {
        codeOfConductRef.on('value', data => {
          const codeOfConduct = data.val() || {}
          this.setState({ codeOfConduct})
        })

        adminsRef.on('child_added', data => {
          this.setState({ admins: [...this.state.admins, {...data.val(), key: data.key }] })
        })
  
        adminsRef.on('child_removed', data => {
          this.setState({ admins: this.state.admins.filter(x => x.key !== data.key) })
        })

        userStatusRef.on('child_added', data => {
          let showPage = "home"
          if (data.val().accepted) showPage="app"
          this.setState({ userStatus: {...data.val(), key: data.key }, currentPage: showPage })
        })

        userReportsRef.on('child_added', data => {
          this.setState({ reports: [...this.state.reports, {...data.val(), key: data.key }]})
        })

        userReportsRef.on('child_changed', data => {
          this.setState(prevState => ({reports: prevState.reports.map(r => r.key === data.key ? {...data.val(), key: data.key} : r)}))
        })

        //The function below will hide the login screen component with a 1/2 second delay to provide an oppt for firebase data to downlaod
        this.hideLogInScreen = setTimeout(() => {
          this.setState( {isLoggedIn: true})
        }, 500)

      }
      wireListeners()

    }).catch(()=> this.setState({logInFailed: true}))
  }

  render() {
    return (
      <KeyboardAvoidingView style={s.container} behavior={Platform.select({ios: "padding", android: null})}>
        <TitleBar title="Code of Conduct" client={client} signin={this.signin} />
        {this.state.isLoggedIn ? this.renderPage() : <LoadingView LogInFailed={this.state.LogInFailed}/>}
      </KeyboardAvoidingView>
    )
  }

  renderPage = () => {
    switch (this.state.currentPage) {
      case 'home':
        return <AcceptView codeOfConduct={this.state.codeOfConduct} markAccepted={this.markAccepted}/>
      case "app":
        return <AppView admins={this.state.admins} currentAppPage={this.state.currentAppPage} showReport={this.showReport} showCodeOfConduct={this.showCodeOfConduct} showModal={this.showModal} codeOfConduct={this.state.codeOfConduct} makeNewReport={this.makeNewReport} reports={this.state.reports} currentReport={this.state.currentReport} saveReport={this.saveReport} updateItem={this.updateItem}/>
      default:
        return <AppView admins={this.state.admins} currentAppPage={this.state.currentAppPage} showReport={this.showReport} showCodeOfConduct={this.showCodeOfConduct} showModal={this.showModal} codeOfConduct={this.state.codeOfConduct} makeNewReport={this.makeNewReport} reports={this.state.reports} currentReport={this.state.currentReport} saveReport={this.saveReport} updateItem={this.updateItem}/>
    }
  }

  updateItem = (variable, input) => {
    const updatedItem = Object.assign({},this.state.currentReport)
    updatedItem[variable] = input
    this.setState({currentReport: updatedItem})
  }

  
  markAccepted = () => {
    fbc.database.private.adminableUserRef('status').push({
      accepted: true
      })
    .catch (x => console.error(x))    
    client.dismissLandingPage(true)
  }
  

  showModal = () => {
    const newReport =  Object.assign({}, blankReport)
    const current = this.state.currentAppPage
    let switchPage = "modal"
    if (current === "modal") switchPage = "home"
    this.setState({currentReport: newReport, currentAppPage: switchPage})
  }

  showCodeOfConduct = () => {
    const current = this.state.currentAppPage
    let switchPage = "code"
    if (current === "code") switchPage = "home"
    this.setState({currentAppPage: switchPage})
  }

  showReport = (report) => {
    let currentReport = report
    const current = this.state.currentAppPage
    let switchPage = "report"
    if (current === "report") {
      switchPage = "home"
      currentReport = Object.assign({}, blankReport)
    }
    this.setState({currentAppPage: switchPage, currentReport})
  }



  saveReport = () => {
    const newReport =  Object.assign({}, blankReport)
    let newItem = this.state.currentReport
    newItem.description = newItem.description.trim()
    newItem.dateCreate = new Date().getTime()
    fbc.database.private.adminableUserRef('reports').push(newItem)
    .then(() => this.setState({currentPage: "app", currentAppPage: "home", currentReport: newReport}))
    .catch (x => console.error(x)) 
  }


}



const blankReport = {
  isAnom: false,
  creator: client.currentUser,
  preferredContact: "",
  description: "",
  status: "Received"
}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  scroll: {
    flex: 1,
    padding: 15
  },
  task: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  checkmark: {
    textAlign: 'center',
    fontSize
  },
  creatorAvatar: {
    marginRight: 4
  },
  creatorEmoji: {
    marginRight: 4,
    fontSize
  },
  taskText: {
    fontSize,
    flex: 1
  },
  compose: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10
  },
  sendButtons: {
    justifyContent: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    margin: 5
  },
  sendButtonText: {
    fontSize: 20,
    color: 'gray'
  },
  composeText: {
    flex: 1
  }
})

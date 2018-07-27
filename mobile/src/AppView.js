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
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, Button, ScrollView
} from 'react-native'
import client, { Avatar, TitleBar } from '@doubledutch/rn-client'
import CodeOfConductSubView from "./CodeOfConductSubView"
import ReportsSubView from "./ReportsSubView"
import MakeReportSubView from "./MakeReportSubView"
import MakeReportModal from "./MakeReportModal"
import CodeOfConductModal from "./CodeOfConductModal"
import ViewReportModal from "./ViewReportModal"

export default class AppView extends Component {
  constructor() {
    super()
    this.state = { 
    
    }

  }

  renderHome() {
    return (
      <ScrollView style={{flex: 1}}>
        <CodeOfConductSubView codeOfConduct={this.props.codeOfConduct} showCodeOfConduct={this.props.showCodeOfConduct}/>
        <ReportsSubView reports={this.props.reports} showReport={this.props.showReport}/>
        <MakeReportSubView showModal={this.props.showModal} admins={this.props.admins}/>
      </ScrollView>
    )
  }

  render() {
    switch (this.props.currentAppPage) {
      case 'modal':
        return <MakeReportModal showModal={this.props.showModal} saveReport={this.props.saveReport} currentReport={this.props.currentReport} updateItem={this.props.updateItem} makeReport={this.props.makeReport}/>
      case "home":
        return this.renderHome()
      case "code":
        return <CodeOfConductModal codeOfConduct={this.props.codeOfConduct} showCodeOfConduct={this.props.showCodeOfConduct}/>
      case "report":
        return <ViewReportModal currentReport={this.props.currentReport} showReport={this.props.showReport}/>
      default:
        return this.renderHome()
    }
  }


}

const s = ReactNative.StyleSheet.create({

})

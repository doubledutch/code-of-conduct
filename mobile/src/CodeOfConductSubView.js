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
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, Button
} from 'react-native'
import client from '@doubledutch/rn-client'


export default class CodeOfConductSubView extends Component {

  render() {
    return (
      <View style={s.container}>
        <Text style={s.titleText}>CODE OF CONDUCT</Text>
        <Text style={s.shortCode}>{this.getText()}</Text>
        <TouchableOpacity style={s.tabButton} onPress={this.props.showCodeOfConduct}><Text style={s.tabButtonText}>{"View Full Code of Conduct"}</Text></TouchableOpacity>
      </View>
    )
  }

  getText = () => {
    if (this.props.codeOfConduct.text) {
      return this.props.codeOfConduct.text.replace(/<br\s*\/?>/g, '\n')
    }
  }

}

const s = ReactNative.StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 15
  },
  titleText: {
    fontSize: 18,
    color: "#3D4A4D",
    marginBottom: 20
  },
  completeCode: {
    flex: 1,
    color: "#A1A1A1"
  },
  shortCode: {
    height: 200,
    color: "#A1A1A1"
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "white"
  },
  tabButtonText: {
    color: client.primaryColor,
    fontSize: 14,
    marginTop: 15,
    marginBottom: 0
  }
})
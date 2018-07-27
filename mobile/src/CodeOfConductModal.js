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
import client from '@doubledutch/rn-client'


export default class CodeOfConductModal extends Component {

  render() {
    return (
      <View style={s.container}>
        {this.renderHeaderBar()}
        <ScrollView style={{flex: 1}}>
          <Text style={s.completeCode}>{this.getText()}</Text>
        </ScrollView>
      </View>
    )
  }

  getText = () => {
    if (this.props.codeOfConduct.text) {
      return this.props.codeOfConduct.text.replace(/<br\s*\/?>/g, '\n')
    }
  }

  renderHeaderBar = () => {
    return (
      <View style={s.headerContainer}>
        <TouchableOpacity style={s.headerButton} onPress={this.props.showCodeOfConduct}>
          <Text style={s.headerButtonText}>X</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Code of Conduct</Text>
        <View style={{width: 20, height: 10}}></View>
      </View>
    )
  }


}

const s = ReactNative.StyleSheet.create({
  headerButton : {
    width: 20,
  },
  headerButtonText: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold",
    color: client.primaryColor
  },
  headerContainer: {
    flexDirection: "row", 
    borderBottomColor: "#F0F0F0", 
    borderBottomWidth: 1, 
    height: 60, 
    alignItems: "center", 
    paddingLeft: 15,
    paddingRight: 15
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: "#848484",
    textAlign: "center"
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    color: "#3D4A4D",
    marginBottom: 20
  },
  completeCode: {
    flex: 1,
    color: "#A1A1A1",
    padding: 15
  },
})
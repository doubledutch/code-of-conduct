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
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, ScrollView, View, Image
} from 'react-native'
import client from '@doubledutch/rn-client'


export default class AcceptView extends Component {
  constructor() {
    super()
    this.state = {
    }

  }

  render() {
    return (
        <ScrollView style={{flex: 1, backgroundColor: "white"}}>
          {this.props.codeOfConduct.text && <View style={{paddingBottom: 50}}>
            <Text style={s.title}>{client.currentEvent.name + " Code of Conduct"}</Text>
            <Text style={s.text}>{this.getText()}</Text>
            <TouchableOpacity style={s.noBorderButton}><Text style={s.noBorderText}>I do not agree to the code of conduct</Text></TouchableOpacity>
            <TouchableOpacity onPress={this.props.markAccepted} style={s.launchButton}><Text style={s.launchButtonText}>I agree to the code of conduct</Text></TouchableOpacity>
          </View>}
        </ScrollView>
   
    )
  }

  getText = () => {
    if (this.props.codeOfConduct.text) {
      return this.props.codeOfConduct.text.replace(/<br\s*\/?>/g, '\n')
    }
  }


}

const s = ReactNative.StyleSheet.create({
  text: {
    fontSize: 18,
    color: "#4B4B4B",
    margin: 20,
    marginTop: 0
  },

  title: {
    fontSize: 22,
    color: "#4B4B4B",
    margin: 20
  },

  launchButton: {
    height: 46,
    backgroundColor: client.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginTop: 40,
    borderRadius: 4
  },
  noBorderButton: {
    backgroundColor: "white",
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noBorderText:{
    fontSize: 14,
    color: "#ACACAC"
  },
  launchButtonText: {
    color: "#FFFFFF",
    fontSize: 18
  }
})

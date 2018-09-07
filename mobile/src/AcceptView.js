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
  constructor(props) {
    super(props)
    this.checkForNoCodeOfConduct(props)
  }

  componentDidUpdate(prevProps) {
    this.checkForNoCodeOfConduct(this.props)
  }

  checkForNoCodeOfConduct(props) {
    if (props.codeOfConduct && !props.codeOfConduct.text) {
      client.dismissLandingPage(false)
    }
  }

  render() {
    const {codeOfConduct} = this.props
  
    return (
      <View style={s.flex}>
      { codeOfConduct
        ? codeOfConduct.text
          ? <ScrollView style={s.scrollView}>
              <View style={s.paddingBottom}>
                <Text style={s.titleTop}>{client.currentEvent.name}</Text>
                <Text style={s.title}>{"Code of Conduct"}</Text>
                <Text style={s.text}>{this.props.codeOfConduct.text}</Text>
                <TouchableOpacity style={s.noBorderButton} onPress={()=>client.openURL('dd://leaveevent')}><Text style={s.noBorderText}>I do not agree to the code of conduct</Text></TouchableOpacity>
                <TouchableOpacity onPress={this.props.markAccepted} style={s.launchButton}><Text style={s.launchButtonText}>I agree to the code of conduct</Text></TouchableOpacity>
              </View>
            </ScrollView>
          : <View style={s.helpTextView}><Text style={s.helpText}>No Code of Conduct has been set</Text></View>
        : null
      }
      </View>
   
    )
  }
}

const s = ReactNative.StyleSheet.create({
  text: {
    fontSize: 18,
    color: "#4B4B4B",
    margin: 20,
    marginTop: 0,
  },
  helpTextView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    flex: 1
  },
  paddingBottom: {
    paddingBottom: 50
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white"
  },
  helpText: {
    fontSize: 18,
    color: "#4B4B4B",
    margin: 20,
    textAlign: "center",
  },
  titleTop: {
    fontSize: 22,
    color: "#4B4B4B",
    margin: 20,
    marginBottom: 5,
    textAlign: "center"
  },
  title: {
    fontSize: 22,
    color: "#4B4B4B",
    margin: 20,
    marginTop: 0,
    textAlign: "center"
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

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
import client, { Avatar } from '@doubledutch/rn-client'


export default class MakeReportSubView extends Component {
  constructor() {
    super()
    this.state = { 
      isModal: false
    }
  }

  render() {
    const admins = this.props.admins || 0
    return (
      <View style={s.container}>
        {this.renderTopBox()}
        {admins.length > 0 && <View>
          <View style={s.border}/>
          {this.renderBottomBox()}
        </View>}
      </View>
    )
  }

  renderTopBox = () => {
    return (
      <View>
        <Text style={s.headerTitleText}>REPORT A VIOLATION</Text>
        <Text style={s.title}>Message the Organizers</Text>
        <Text style={s.description}>Send a description of the violation to the event organizer, and they will see to it until the situation is resolved</Text>
        <TouchableOpacity style={s.button} onPress={this.props.showModal}><Text style={s.buttonText}>Report a Violation</Text></TouchableOpacity>
      </View>
    )
  }

  renderBottomBox = () => {
    return (
      <View>
        <Text style={s.title}>Trusted Persons</Text>
        <Text style={s.description}>If you've experienced a violation of the code of conduct seek out or message a Trusted Person, all of whom are specially trained to help.</Text>
        {this.trustedPersonsTable()}
      </View>
    )
  }

  getText = () => {
    if (this.props.codeOfConduct.text) {
      return this.props.codeOfConduct.text.replace(/<br\s*\/?>/g, '\n')
    }
  }

  trustedPersonsTable = () => {
    const admins = this.props.admins || []
    if (admins.length > 0) return (
      <View style={s.table}>
        { admins.map((person, i) => {
         return (
           <View style={s.userCell} key={i}>
              <Avatar user={person} size={40}/>
              <Text numberOfLines={2} ellipsizeMode={"tail"} style={s.name}>{person.firstName + " " + person.lastName}</Text>
              <View style={{flex: 1}}/>
              <TouchableOpacity style={s.messageButton} onPress={() => client.openURL(`dd://profile/${person.id}`)}>
                <Text style={s.buttonText}>Message</Text>
              </TouchableOpacity>
          </View>
         )
        }) }
      </View>
    )
  }


  changeIsExpanded = () => {
    const current = this.state.isExpanded
    this.setState({isExpanded: !current})
  }


}

const s = ReactNative.StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 15,
    marginTop: 15
  },
  headerTitleText: {
    fontSize: 18,
    color: "#3D4A4D",
    marginBottom: 20
  },
  table: {
    flexDirection: "column",
    flexWrap: 'wrap',
    marginTop: 10,
  },
  name:{
    fontSize: 14,
    color: "#3D4A4D",
    marginLeft: 10,
    maxWidth: 100
  },
  firstName:{
    fontSize: 14,
    color: "#3D4A4D",
    marginLeft: 10
  },
  lastName:{
    fontSize: 14,
    marginLeft: 5,
    color: "#3D4A4D",
  },
  userCell: {
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: "center",
    alignItems: "center",
    shadowOffset:{  width: 1,  height: 1,  },
    shadowColor: 'black',
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontSize: 14,
    color: client.primaryColor
  },
  messageButton: {
    height: 30,
    width: 88,
    borderColor: client.primaryColor,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  description: {
    flex: 1,
    color: "#3D4A4D",
    fontSize: 14,
  },
  title: {
    fontWeight: "bold",
    color: "#3D4A4D",
    fontSize: 14,
    marginBottom: 10
  },
  border: {
    height: 1,
    flex: 1,
    backgroundColor: "gray",
    marginTop: 25,
    marginBottom: 25
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
    borderColor: client.primaryColor,
    borderRadius: 5,
    padding: 15,
    borderWidth: 1,
    marginTop: 10
  },
  buttonText: {
    color: client.primaryColor,
    fontSize: 14,
    fontWeight: "bold"
  }
})
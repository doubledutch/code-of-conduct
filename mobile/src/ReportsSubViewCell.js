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
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, Button, FlatList
} from 'react-native'
import client from '@doubledutch/rn-client'



export default class ReportsSubViewCell extends Component {
  constructor() {
    super()
  }

  render() {
    const {report} = this.props
    return (
      <View>
        <TouchableOpacity style={s.cell} onPress={()=>this.props.showReport(report)}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <View style={{flex: 1, marginRight: 15}}>
              <Text style={s.description} ellipsizeMode={"tail"} numberOfLines={1}>{report.description}</Text>
              <View style={{flexDirection: "row", marginTop: 5}}>
                <Text style={s.headingText}>Report:</Text>
                <Text style={[{marginRight: 15}, s.description]}>{this.convertTime(report.dateCreate)}</Text>
                <Text style={s.headingText}>Status: </Text>
                <Text style={report.status === "Received" ? s.yellowText : s.greenText}>{report.status}</Text>
              </View>
            </View>
            <Text style={{fontSize: 25, color: client.primaryColor}}>></Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }


  convertTime = (dateString) => {
    const date = new Date(dateString)
    return ( 
      date.toLocaleString('en-US', {month: "2-digit", day: "2-digit", year: "numeric", hour: '2-digit', minute:'2-digit'})
    )
  }

}

const s = ReactNative.StyleSheet.create({
  cell: {
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  description: {
    color: "#A1A1A1",
  },
  headingText: {
    color: "#3D4A4D",
  },
  yellowText: {
    color: "#F6B343"
  },
  greenText: {
    color: "#9AD55E"
  }
})
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
import { StyleSheet, Text, View, FlatList } from 'react-native'
import ReportsSubViewCell from "./ReportsSubViewCell"

export default class ReportsSubView extends Component {
  state = { isExpanded: false }

  render() {
    const reports = this.props.reports || []
    reports.sort((a,b) => b.dateCreate - a.dateCreate)
    return (
      <View style={s.container}>
        <Text style={s.titleText}>REPORTED VIOLATIONS</Text>
        <View style={s.border}/>
        <View style={s.listContainer}>
          <FlatList 
            data={reports}
            renderItem={({item}) => <ReportsSubViewCell report={item} showReport={this.props.showReport} primaryColor={this.props.primaryColor} />} 
          />
        </View>
      </View>
    )
  }
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    marginTop: 20
  },
  border: {
    height: 1,
    flex: 1,
    backgroundColor: "gray"
  },
  listContainer: {
    marginTop: 10
  },
  titleText: {
    fontSize: 18,
    color: "#3D4A4D",
    margin: 20,
    marginLeft: 15
  },
})

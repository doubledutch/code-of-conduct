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
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native'
import { translate as t } from '@doubledutch/rn-client'

export default class ViewReportModal extends Component {
  render() {
    return (
      <View style={s.container}>
        {this.renderHeaderBar()}
        <ScrollView style={s.scroll}>{this.renderReportBox()}</ScrollView>
      </View>
    )
  }

  renderReportBox = () => {
    const { currentReport } = this.props
    return (
      <View style={s.container}>
        <View style={s.boxHeader}>
          <View style={s.leftRow}>
            <Text style={s.headingText}>{t('reported')}</Text>
            <Text style={s.description}>{this.convertTime(currentReport.dateCreate)}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.headingText}>{t('status')}</Text>
            <Text style={currentReport.status === 'Received' ? s.yellowText : s.greenText}>
              {currentReport.status}
            </Text>
          </View>
        </View>
        <Text style={s.description}>{this.props.currentReport.description}</Text>
      </View>
    )
  }

  convertTime = dateString => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  renderHeaderBar = () => {
    const { primaryColor } = this.props
    return (
      <View style={s.headerContainer}>
        <TouchableOpacity style={s.headerButton} onPress={() => this.props.showReport('')}>
          <Text style={[s.headerButtonText, { color: primaryColor }]}>X</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('reportedViolation')}</Text>
        <View style={{ width: 20, height: 10 }} />
      </View>
    )
  }
}

const s = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  leftRow: {
    flexDirection: 'row',
    marginRight: 20,
  },
  row: {
    flexDirection: 'row',
  },
  description: {
    color: '#A1A1A1',
  },
  headingText: {
    color: '#3D4A4D',
  },
  yellowText: {
    color: '#F6B343',
  },
  greenText: {
    color: '#9AD55E',
  },
  headerButton: {
    width: 20,
  },
  headerButtonText: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    height: 60,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: '#848484',
    textAlign: 'center',
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    color: '#3D4A4D',
    marginBottom: 20,
  },
  completeCode: {
    flex: 1,
    color: '#A1A1A1',
    padding: 15,
  },
})

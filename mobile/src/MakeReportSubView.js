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
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import client, { Avatar, translate as t } from '@doubledutch/rn-client'

export default class MakeReportSubView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModal: false,
    }
    this.s = createStyles(props)
  }

  render() {
    const admins = this.props.admins || 0
    return (
      <View style={s.container}>
        {this.renderTopBox()}
        {admins.length > 0 && (
          <View>
            <View style={s.border} />
            {this.renderBottomBox()}
          </View>
        )}
      </View>
    )
  }

  renderTopBox = () => (
    <View>
      <Text style={s.headerTitleText}>{t('reportAViolationCap')}</Text>
      <Text style={s.title}>{t('messageOrg')}</Text>
      <Text style={s.description}>{t('reportDes')}</Text>
      <TouchableOpacity style={[s.button, this.s.primaryBorder]} onPress={this.props.showModal}>
        <Text style={[s.buttonText, this.s.primary]}>{t('reportAViolation')}</Text>
      </TouchableOpacity>
    </View>
  )

  renderBottomBox = () => (
    <View>
      <Text style={s.title}>{t('trusted')}</Text>
      <Text style={s.description}>{t('trustedDes')}</Text>
      {this.trustedPersonsTable()}
    </View>
  )

  trustedPersonsTable = () => {
    const admins = this.props.admins || []
    if (admins.length > 0)
      return (
        <View style={s.table}>
          {admins.map((person, i) => {
            const isUser = person.id === this.props.currentUser.id
            return (
              <View style={s.userCell} key={i}>
                <Avatar user={person} size={40} />
                <Text numberOfLines={2} ellipsizeMode="tail" style={s.name}>{`${person.firstName} ${
                  person.lastName
                }`}</Text>
                <View style={{ flex: 1 }} />
                {!isUser && <TouchableOpacity
                  style={[s.messageButton, this.s.primaryBorder]}
                  onPress={() => client.openURL(`dd://profile/${person.id}`)}
                >
                  <Text style={[s.buttonText, this.s.primary]}>{t('message')}</Text>
                </TouchableOpacity>}
              </View>
              )
            }
          )}
        </View>
      )
  }

  changeIsExpanded = () => {
    const current = this.state.isExpanded
    this.setState({ isExpanded: !current })
  }
}

const createStyles = ({ primaryColor }) =>
  StyleSheet.create({
    primaryBorder: { borderColor: primaryColor },
    primary: { color: primaryColor },
  })

const s = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 15,
    marginTop: 15,
  },
  headerTitleText: {
    fontSize: 18,
    color: '#3D4A4D',
    marginBottom: 20,
  },
  table: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  name: {
    fontSize: 14,
    color: '#3D4A4D',
    marginLeft: 10,
    maxWidth: 100,
  },
  firstName: {
    fontSize: 14,
    color: '#3D4A4D',
    marginLeft: 10,
  },
  lastName: {
    fontSize: 14,
    marginLeft: 5,
    color: '#3D4A4D',
  },
  userCell: {
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
  },
  messageButton: {
    height: 30,
    width: 88,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    flex: 1,
    color: '#3D4A4D',
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    color: '#3D4A4D',
    fontSize: 14,
    marginBottom: 10,
  },
  border: {
    height: 1,
    flex: 1,
    backgroundColor: 'gray',
    marginTop: 25,
    marginBottom: 25,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    borderWidth: 1,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})

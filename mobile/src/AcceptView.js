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
import { StyleSheet, TouchableOpacity, Text, ScrollView, View, TextInput } from 'react-native'
import client from '@doubledutch/rn-client'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { translate as t } from '@doubledutch/rn-client'

export default class AcceptView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionResponse: '',
      isQuestionResponseTrue: undefined,
    }
  }

  render() {
    const { currentEvent, primaryColor, codeOfConduct, customCodeOfConduct } = this.props
    const code = customCodeOfConduct || codeOfConduct
    const isQuestion = customCodeOfConduct ? !!customCodeOfConduct.question.text : false
    return (
      <View style={s.flex}>
        {code ? (
          code.text ? (
            <KeyboardAwareScrollView
              viewIsInsideTabBar
              enableAutomaticScroll
              keyboardShouldPersistTaps="always"
            >
              <View style={s.paddingBottom}>
                <Text style={s.titleTop}>{currentEvent.name}</Text>
                <Text style={s.title}>{t('title')}</Text>
                <Text style={s.text}>{code.text}</Text>
                {code.question && this.renderQuestion(code.question)}
                <TouchableOpacity
                  style={s.noBorderButton}
                  onPress={() => client.openURL('dd://leaveevent')}
                >
                  <Text style={s.noBorderText}>{t('deny')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    this.props.customCodeOfConduct
                      ? () => this.props.markAcceptedCustom(this.state.questionResponse)
                      : this.props.markAccepted
                  }
                  style={[
                    s.launchButton,
                    {
                      backgroundColor:
                        isQuestion && this.state.questionResponse.trim().length === 0
                          ? 'gray'
                          : primaryColor,
                    },
                  ]}
                  disabled={isQuestion ? this.state.questionResponse.trim().length === 0 : false}
                >
                  <Text style={s.launchButtonText}>{t('accept')}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          ) : (
            <View style={s.helpTextView}>
              <Text style={s.helpText}>{t('notSet')}</Text>
            </View>
          )
        ) : null}
      </View>
    )
  }

  renderQuestion = question => {
    const { primaryColor } = this.props
    if (question.text.length)
      return (
        <View style={{ marginLeft: 20, marginRight: 20 }}>
          <Text style={s.customQuestion}>{question.text}</Text>
          {question.isTrueFalse ? (
            <View>
              <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ isQuestionResponseTrue: true, questionResponse: 'true' })
                  }
                  style={[
                    s.radio,
                    this.state.isQuestionResponseTrue ? { borderColor: primaryColor } : null,
                  ]}
                >
                  {this.state.isQuestionResponseTrue ? (
                    <View style={[s.radioDot, { backgroundColor: primaryColor }]} />
                  ) : null}
                </TouchableOpacity>
                <Text style={s.boolText}>{t('true')}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ isQuestionResponseTrue: false, questionResponse: 'false' })
                  }
                  style={[
                    s.radio,
                    this.state.isQuestionResponseTrue === false
                      ? { borderColor: primaryColor }
                      : null,
                  ]}
                >
                  {this.state.isQuestionResponseTrue === false ? (
                    <View style={[s.radioDot, { backgroundColor: primaryColor }]} />
                  ) : null}
                </TouchableOpacity>
                <Text style={s.boolText}>{t('false')}</Text>
              </View>
            </View>
          ) : (
            <TextInput
              multiline
              value={this.state.questionResponse}
              onChangeText={answer => this.setState({ questionResponse: answer })}
              style={{
                height: 60,
                flex: 1,
                borderWidth: 1,
                borderColor: '#c4c4c4',
                marginTop: 20,
                borderRadius: 5,
              }}
            />
          )}
        </View>
      )
    return null
  }
}

const s = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#4B4B4B',
    margin: 20,
    marginTop: 0,
    flex: 1,
  },
  helpTextView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
    backgroundColor: 'white',
  },
  boolText: {
    marginLeft: 5,
    marginTop: 2,
    color: '#4B4B4B',
  },
  customQuestion: {
    fontWeight: 'bold',
    color: '#4B4B4B',
    fontSize: 16,
  },
  paddingBottom: {
    paddingBottom: 200,
  },
  helpText: {
    fontSize: 18,
    color: '#4B4B4B',
    margin: 20,
    textAlign: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: '#c4c4c4',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  titleTop: {
    fontSize: 22,
    color: '#4B4B4B',
    margin: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: '#4B4B4B',
    margin: 20,
    marginTop: 0,
    textAlign: 'center',
  },
  launchButton: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    marginTop: 40,
    borderRadius: 4,
  },
  noBorderButton: {
    backgroundColor: 'white',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noBorderText: {
    fontSize: 14,
    color: '#ACACAC',
  },
  launchButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
})

import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image, TextInput, Platform } from 'react-native'
import client, { Avatar, Color } from '@doubledutch/rn-client'

export default class MakeReportModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      color: 'white',
      borderColor: '#EFEFEF',
      inputHeight: 0,
      isError: false,
      isSaving: false,
      currentContact: '',
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderTopBox()}
        <TouchableOpacity style={s.modalBottom} onPress={this.props.showModal} />
      </View>
    )
  }

  renderTopBox = () => {
    const newStyle = {
      flex: 1,
      fontSize: 18,
      color: '#364247',
      textAlignVertical: 'top',
      maxHeight: 100,
      height: Math.max(35, this.state.inputHeight),
      paddingTop: 0,
      paddingLeft: 20,
    }

    const androidStyle = {
      marginTop: 17,
      marginBottom: 10,
    }

    const iosStyle = {
      marginTop: 20,
      marginBottom: 10,
    }

    const { currentUser } = this.props

    let borderColor = this.state.borderColor
    if (this.state.isError && this.props.currentReport.description.trim().length === 0) {
      borderColor = 'red'
    }
    const borderStyle = { borderColor }

    return (
      <View style={{ backgroundColor: 'white' }}>
        <View style={[s.modal, borderStyle]}>
          <TextInput
            style={Platform.select({
              ios: [newStyle, iosStyle],
              android: [newStyle, androidStyle],
            })}
            placeholder="What happened?"
            value={this.props.currentReport.description}
            onChangeText={report => this.updateItem('description', report)}
            maxLength={250}
            multiline
            placeholderTextColor="#9B9B9B"
            onContentSizeChange={event => this._handleSizeChange(event)}
          />
          <Text style={s.counter}>{250 - this.props.currentReport.description.length || 0} </Text>
        </View>
        <View style={s.bottomButtons}>
          <View style={s.rightBox}>
            {this.state.isError && this.props.currentReport.description.trim().length === 0 && (
              <Text style={{ color: 'red', paddingTop: 2, fontSize: 12, marginLeft: 10 }}>
                *Please enter a description
              </Text>
            )}
            <View style={s.anomBox}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => this.updateItem('isAnom', !this.props.currentReport.isAnom)}
                >
                  <Image
                    style={s.checkButton}
                    source={{
                      uri: this.props.currentReport.isAnom
                        ? 'https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/checkbox_active.png'
                        : 'https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/checkbox_inactive.png',
                    }}
                  />
                </TouchableOpacity>
                <Text style={s.anomText}>Report anonymously</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  height: 25,
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Avatar user={currentUser} size={25} />
                <Text numberOfLines={2} ellipsizeMode="tail" style={s.nameText}>{`${
                  currentUser.firstName
                } ${currentUser.lastName}`}</Text>
              </View>
            </View>
          </View>
        </View>
        {this.radioButtonsSection()}
      </View>
    )
  }

  radioButtonsSection = () => {
    const { currentReport, primaryColor } = this.props
    const sendButtonStyle = {
      backgroundColor: new Color(primaryColor).limitLightness(0.9).rgbString(),
    }
    return (
      <View style={{ display: 'flex', paddingBottom: 40, marginTop: 30 }}>
        {!this.props.currentReport.isAnom && (
          <View>
            <Text style={s.headerTitleText}>Preferred Contact Method</Text>
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => this.updateItem('preferredContact', 'email')}
                    style={{ padding: 10 }}
                  >
                    {this.radioButton(currentReport, 'email')}
                  </TouchableOpacity>
                  <Text style={s.radioTitle}>Email</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => this.updateItem('preferredContact', 'inapp')}
                    style={{ padding: 10 }}
                  >
                    {this.radioButton(currentReport, 'inapp')}
                  </TouchableOpacity>
                  <Text style={s.radioTitle}>In-App Message</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => this.updateItem('preferredContact', 'phone')}
                    style={{ padding: 10 }}
                  >
                    {this.radioButton(currentReport, 'phone')}
                  </TouchableOpacity>
                  <Text style={s.radioTitle}>Phone Call</Text>
                </View>
              </View>
              {this.state.isError && currentReport.preferredContact.length === 0 && (
                <Text style={{ color: 'red', paddingTop: 2, fontSize: 12, marginLeft: 10 }}>
                  *Please select a preferred contact method
                </Text>
              )}
              {this.props.currentReport.preferredContact === 'phone' && (
                <TextInput
                  style={this.state.isError ? s.phoneInputError : s.phoneInput}
                  placeholder="555-555-5555"
                  keyboardType="phone-pad"
                  value={this.props.currentReport.phone}
                  onChangeText={phone => this.props.updateItem('phone', phone)}
                />
              )}
              {this.state.isError &&
                !this.checkPhone() &&
                this.props.currentReport.preferredContact === 'phone' && (
                  <Text style={{ color: 'red', paddingTop: 2, fontSize: 12, marginLeft: 10 }}>
                    *Please enter valid phone
                  </Text>
                )}
            </View>
          </View>
        )}
        <TouchableOpacity
          style={[s.sendButton, sendButtonStyle]}
          disabled={this.state.isSaving}
          onPress={this.checkValues}
        >
          <Text style={s.sendButtonText}>Report Violation</Text>
        </TouchableOpacity>
      </View>
    )
  }

  checkValues = () => {
    const report = this.props.currentReport
    let phoneStatus = true
    if (report.preferredContact === 'phone') {
      phoneStatus = this.checkPhone()
    }
    if (report.isAnom && report.description.trim().length > 0) {
      this.setState({ isSaving: true })
      this.props.saveReport()
    }
    if (report.preferredContact.length > 0 && phoneStatus && report.description.trim().length > 0) {
      this.setState({ isSaving: true })
      this.props.saveReport()
    } else this.setState({ isError: true })
  }

  updateItem = (variable, input) => {
    this.props.updateItem(variable, input)
    this.setState({ isError: false })
  }

  checkPhone = () => {
    const report = this.props.currentReport
    let phoneNum = 'a'
    if (report.phone) phoneNum = report.phone
    return phoneNum.match(/\d/g) !== null
  }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height,
    })
  }

  makeTrue = () => {
    const currentAnom = this.state.anomStatus
    this.setState({ anomStatus: !currentAnom })
  }

  radioButton = (item, status) => (
    <View
      style={{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: this.props.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {item.preferredContact === status ? (
        <View
          style={{
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: this.props.primaryColor,
          }}
        />
      ) : null}
    </View>
  )
}

const s = StyleSheet.create({
  modal: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  modalBottom: {
    display: 'flex',
    backgroundColor: 'black',
    opacity: 0.5,
    flex: 1,
  },
  radioTitle: {
    color: '#364247',
    fontSize: 14,
  },
  phoneInput: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'gray',
    height: 43,
    width: 150,
    paddingLeft: 15,
    marginLeft: 10,
    color: '#364247',
  },
  phoneInputError: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'red',
    height: 43,
    width: 150,
    paddingLeft: 15,
    marginLeft: 10,
    color: '#364247',
  },
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  bottomButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  headerTitleText: {
    fontSize: 18,
    color: '#3D4A4D',
    marginBottom: 10,
    marginLeft: 20,
  },

  anomBox: {
    flexDirection: 'row',
    paddingRight: 20,
    marginLeft: 10,
  },
  rightBox: {
    flex: 1,
    flexDirection: 'column',
  },
  anomText: {
    flex: 1,
    fontSize: 14,
    color: '#364247',
    marginLeft: 5,
    marginTop: 16,
  },
  nameText: {
    fontSize: 14,
    color: '#364247',
    marginLeft: 10,
    width: 100,
  },
  counter: {
    justifyContent: 'center',
    marginTop: 23,
    width: 30,
    fontSize: 14,
    marginRight: 11,
    height: 20,
    color: '#9B9B9B',
    textAlign: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    marginTop: 20,
    marginRight: 20,
    width: 146,
    height: 37,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  checkButton: {
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: 15,
    height: 19,
    width: 19,
  },
  sendButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
})

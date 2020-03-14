import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

Notifications.createChannelAndroidAsync('Confusion', {
    name: 'Confusion',
    sound: true,
    vibrate: true
})

class Reservation extends Component {

    constructor(props){
        super(props);
        this.state = {
            guest: 1,
            smoking: false,
            date: ''
        }
    }

    static navigationOptions = {
        title: 'Reserve Table'
    };

    resetForm() {
        this.setState({
            guest: 1,
            smoking: false,
            date: '',
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservstion for' + date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        })
    }

    render() {
        
        return (
            <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
                <ScrollView>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guest}
                            onValueChange={(itemValue, itemIndex) => this.setState({ guest: itemValue})}
                            >
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor='#512DA8'
                            onValueChange={(value) => this.setState({ smoking: value })}
                            >
                        </Switch>
                    </View>   
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker 
                            style={{flex: 2, marginRight: 20}}
                            date={this.state.date}
                            format=''
                            mode='datetime'
                            placeholder='select date and time'
                            minDate='2020-01-01'
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => {this.setState({ date: date })}}
                            />
                    </View>   
                    <View style={styles.formRow}>
                        <Button 
                            title='Reserve'
                            color='#512DA8'
                            onPress={() => 
                                Alert.alert(
                                    'Your reservation OK?',
                                    'Number of Guests: ' + this.state.guest
                                    + '\nSmoking? ' + (this.state.smoking ? 'Yes' : 'No')
                                    + 'Date and Time: ' + this.state.date,
                                    [
                                        {text: 'Cancel', onPress: () => this.resetForm(), style: 'cancel'},
                                        {text: 'OK', onPress: () => {
                                            this.presentLocalNotification(this.state.date);
                                            this.resetForm();
                                            }
                                        }
                                    ],
                                    {cancelable: false}
                                )
                            }
                            accessibilityLabel='Learn more about this purple button'
                        />
                    </View>
                </ScrollView>
            </Animatable.View>
        );
    }
}


styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
})

export default Reservation;
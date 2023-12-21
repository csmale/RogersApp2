import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import MyInput from '../components/MyInput.js';
import Password from '../components/Password.js';
import MyButton from '../components/MyButton.js';
import { changePassword } from '../components/Backend.js';
import AppContext from '../components/AppContext.js';
import { useContext, useState, useEffect } from 'react';
import { getStatus, loginUser } from '../components/Backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MIN_PASSWORD_LENGTH = 8;

// must set error text to appropriate value if validation fails
function validPassword(pw) {
    return true;
}

export default function ChangePasswordScreen(props) {
    const myContext = useContext(AppContext);
    const navigation = props.navigation;
    const [loginErr, setLoginErr] = useState('');
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [newpassword2, setNewPassword2] = useState('');

    function doCancel() {
        if (myContext.isLoggedIn) {
            navigation.navigate('Settings');
        } else {
            navigation.navigate('Start');
        }
    }
    function doChange() {
        setLoginErr('');
        if(myContext.IsLoggedIn && oldpassword == '') {
            setLoginErr('Please enter your current password');
            return;
        }
        if (newpassword == '') {
            setLoginErr('Please enter a new password');
            return;
        }
        if (newpassword.length < MIN_PASSWORD_LENGTH) {
            setLoginErr(`New password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }
        if (!validPassword(newpassword)) {
            // error text will have been set
            return;
        }
        if (newpassword != newpassword2) {
            setLoginErr('Passwords do not match');
            return;
        }

        let prof;
        void (async () => {
            prof = await changePassword(myContext.Profile.id, oldpassword, newpassword);
            if (prof.error) {
                setLoginErr(prof.error);
                return;
            } else {
                myContext.setIsLoggedIn(true);
                navigation.navigate('MainNav');
            }
        })();
    }


    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../images/splash.jpg')} />
            <Text style={styles.bigtext}>Change Password</Text>
            {myContext.IsLoggedIn &&
                <Password label='Old password:' placeholder='old password' value={oldpassword} onChangeText={setOldPassword}></Password>}
            <Password label='New password:' placeholder='new password' value={newpassword} onChangeText={setNewPassword}></Password>
            <Password label='Re-enter new password:' placeholder='new password' value={newpassword2} onChangeText={setNewPassword2}></Password>
            {loginErr != "" &&
                <Text style={styles.errText}>{loginErr}</Text>
            }
            <MyButton caption='Change password' onPress={doChange} {...props} />
            <MyButton caption='Cancel' onPress={doCancel} {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: '200px',
        width: '100%'
    },
    text: {
        fontSize: 14,
        fontWeight: "normal"
    },
    errText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "red"
    },
    bigtext: {
        fontSize: 20,
        fontWeight: "bold",
    },
    signup: {
        fontSize: 14,
        fontWeight: "bold"
    },
});

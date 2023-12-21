import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import MyInput from '../components/MyInput.js';
import Password from '../components/Password.js';
import MyButton from '../components/MyButton.js';
import ImageButton from '../components/ImageButton.js';
import AppContext from '../components/AppContext.js';
import { useContext, useState, useEffect, useRef } from 'react';
import { getStatus, loginUser, resumeSession } from '../components/Backend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Device from 'expo-device';

export default function StartScreen(props) {
    const myContext = useContext(AppContext);
    const navigation = props.navigation;
    const [serverStatus, setServerStatus] = useState('?');
    const [loginErr, setLoginErr] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const session = useRef('');
    const deviceId = useRef(Device.deviceName);
    const biometrics = useRef(myContext.UseBiometrics);
    const canLogin = useRef(false);

    function doLogin() {
        setLoginErr('');
        let uname = user;
        let pw = password;
        if (uname == '' || pw == '') {
            setLoginErr('Please enter your user name and password.');
            return;
        }
        let prof;
        void (async () => {
            prof = await loginUser(uname, pw, deviceId.current);
            if (prof.error) {
                setLoginErr(prof.error);
                return;
            } else {
                myContext.setProfile(prof);
                try {
                    await AsyncStorage.setItem('username', uname);
                    await AsyncStorage.setItem('session', prof.session_id);
                    session.current = prof.session_id;
                    myContext.setSession(prof.session_id);
                } catch (e) {
                    // saving error
                }
                if (prof.must_change_password) {
                    navigation.navigate('ChangePassword');
                } else {
                    myContext.setIsLoggedIn(true);
                    navigation.replace('MainNav');
                }
            }
        })();
    }

    useEffect(() => {
        let mounted = true;
        setTimeout(() => {
            if (mounted) {
                void (async () => { setServerStatus(await getStatus()) })();
            }
        }, 1000);
        return () => mounted = false;
    }, []);

    /**
     * Runs every render to check if we need to get a fingerprint
     */
    useEffect(() => {
        async function getLastUser() {
            try {
                const user = await AsyncStorage.getItem('username');
                if (user !== null) {
                    // value previously stored
                    setUser(user);
                };
                const sess = await AsyncStorage.getItem('session');
                if (sess !== null) {
                    // value previously stored
                    console.log(`found previous session: ${sess}`);
                    session.current = sess;
                    myContext.setSession(sess);
                };
                const bio = (await AsyncStorage.getItem('biometrics')) == "y";
                // value previously stored
                biometrics.current = bio;
                myContext.setUseBiometrics(bio);
                console.log(`useBiometrics: ${bio} ${myContext.UseBiometrics}`);
            } catch (e) {
                console.log(e);
                // error reading value
            }

            const biohw = await LocalAuthentication.isEnrolledAsync();
            if (!biohw) {
                console.log(`No biometric hardware`);
                myContext.setUseBiometrics(false);
                biometrics.current = false;
            };
            console.log(`useBiometrics: ${biometrics.current} session: ${session.current}`);
            if (biometrics && session.current) {
                console.log("want to use biometrics");
                const results = await LocalAuthentication.authenticateAsync({
                    cancelLabel: "Cancel",
                    disableDeviceFallback: false,
                    fallbackLabel: "Fallback",
                    promptMessage: "Sign in to GateMaster",
                    requireConfirmation: true
                });
                if (results.success) {
                    console.log(`success: ${results.success}`);
                } else if (results.error === 'unknown') {
                    console.log(results.error);
                } else if (
                    results.error === 'user_cancel' ||
                    results.error === 'system_cancel' ||
                    results.error === 'app_cancel'
                ) {
                    console.log(results.error);
                }

                if (results.success) {
                    const prof = await resumeSession(session.current, deviceId.current);
                    if (prof && !prof.error) {
                        myContext.setProfile(prof);
                        if (prof.must_change_password) {
                            navigation.navigate('ChangePassword');
                        } else {
                            myContext.setIsLoggedIn(true);
                            navigation.replace('MainNav');
                        }
                    } else {
                        setLoginErr('Unable to resume session, please log in again');
                    }
                }
            }
        }
        getLastUser();
    }, []);

    canLogin.current = (user.length > 0 && password.length > 0);

    useEffect(() => {
        myContext.setDeviceId(Device.deviceName);
    });

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../images/splash.jpg')} />
            <Text style={styles.bigtext}>Welcome to GateMaster</Text>
            <Text style={styles.text}>Service Status: {serverStatus}</Text>
            <Text style={styles.text}>Device Name: {deviceId.current}</Text>
            <Text style={styles.text}>Please log in to the application</Text>
            <MyInput label='User name:' placeholder='username' value={user} inputMode='email' onChangeText={setUser}></MyInput>
            <Password label='Password:' placeholder='password' value={password} onChangeText={setPassword}></Password>
            {loginErr != "" &&
                <Text style={styles.errText}>{loginErr}</Text>
            }
            <MyButton caption='Sign in' onPress={doLogin} disabled={!canLogin.current} />
            <Text style={styles.text}>Don't have an account yet?&nbsp;&nbsp;
                <Pressable
                    onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signup}>Sign up</Text>
                </Pressable>
            </Text>
            <ImageButton caption='Google' image={require('../images/login_google.png')} onPress={() => navigation.navigate('Main')} />
            <ImageButton caption='Twitter' image={require('../images/login_microsoft.png')} onPress={() => navigation.navigate('Main')} />
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

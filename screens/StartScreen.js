import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import MyInput from '../components/MyInput.js';
import Password from '../components/Password.js';
import MyButton from '../components/MyButton.js';
import ImageButton from '../components/ImageButton.js';
import AppContext from '../components/AppContext.js';
import { useContext, useState, useEffect } from 'react';
import { getStatus, loginUser } from '../components/Backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartScreen(props) {
    const myContext = useContext(AppContext);
    const navigation = props.navigation;
    const [serverStatus, setServerStatus] = useState('?');
    const [loginErr, setLoginErr] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

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
            prof = await loginUser(uname, pw);
            if (prof.error) {
                setLoginErr(prof.error);
                return;
            } else {
                myContext.setProfile(prof);
                try {
                    await AsyncStorage.setItem('username', uname);
                  } catch (e) {
                    // saving error
                  }
                navigation.navigate('Main');
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
    useEffect(() => {
        async function getLastUser() {
            try {
                const value = await AsyncStorage.getItem('username');
                if (value !== null) {
                    // value previously stored
                    setUser(value);
                };
            } catch (e) {
                // error reading value
            }
        }
        getLastUser();
    }, []);

//        void (async () => {setServerStatus(await getStatus())})();


return (
    <View style={styles.container}>
        <Image style={styles.image} source={require('../images/splash.jpg')} />
        <Text style={styles.bigtext}>Welcome to GateMaster</Text>
        <Text style={styles.text}>Service Status: {serverStatus}</Text>
        <Text style={styles.text}>Please log in to the application</Text>
        <MyInput label='User name:' placeholder='username' value={user} inputMode='email' onChangeText={setUser}></MyInput>
        <Password label='Password:' placeholder='password' value={password} onChangeText={setPassword}></Password>
        {loginErr != "" &&
            <Text style={styles.errText}>{loginErr}</Text>
        }
        <MyButton caption='Sign in' onPress={doLogin} {...props} />
        <Text style={styles.text}>Don't have an account yet?&nbsp;&nbsp;
            <Pressable
                onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signup}>Sign up</Text>
            </Pressable>
        </Text>
        <ImageButton caption='Google' image={require('../images/login_google.png')} onPress={() => navigation.navigate('Main')} {...props} />
        <ImageButton caption='Twitter' image={require('../images/login_microsoft.png')} onPress={() => navigation.navigate('Main')} {...props} />
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

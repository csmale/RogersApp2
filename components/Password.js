import { StyleSheet, View, TextInput, Text } from "react-native";
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Password(props) {
    // State variable to track password visibility 
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the password visibility state 
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'left' }}>
                <Text style={styles.label}>{props.label}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <TextInput style={styles.input}
                    placeholder={props.placeholder}
                    value={props.value}
                    inputMode={props.inputMode}
                    keyboardType={props.keyboardType}
                    secureTextEntry={!showPassword}
                    onChangeText={props.onChangeText}
                />
                <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#aaa"
                    style={styles.icon}
                    onPress={toggleShowPassword}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'left',
        justifyContent: 'left',
        width: '50%',
        marginTop: 8
    },
    input: {
        fontSize: 14,
        fontWeight: "light",
        width: "100%",
        borderBottomWidth: 1.0
    },
    label: {
        fontSize: 16,
        fontWeight: "bold"
    }
});

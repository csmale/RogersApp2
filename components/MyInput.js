import { StyleSheet, View, TextInput, Text } from "react-native";
import { useState } from 'react';

export default function MyInput(props) {
    return (
        <View style={styles.container}>
            <View style={{alignItems: 'left'}}>
                <Text style={styles.label}>{props.label}</Text>
            </View>
            <TextInput style={styles.input}
                placeholder={props.placeholder}
                value={props.value}
                inputMode={props.inputMode}
                keyboardType={props.keyboardType}
                onChangeText={props.onChangeText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'left',
        justifyContent: 'left',
        width: '70%',
        marginTop: 16
    },
    input: {
        fontSize: 14,
        fontWeight: "light",
        width: "100%",
        borderBottomWidth : 1.0
    },
    label: {
        fontSize: 16,
        fontWeight: "bold"
    }
});
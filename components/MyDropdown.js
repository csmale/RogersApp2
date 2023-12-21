
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Fragment, useState } from 'react';

export default function MyDropdown(props) {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{props.label}</Text>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={props.data}
                maxHeight={300}
                labelField={props.labelField}
                valueField={props.valueField}
                placeholder={!isFocus ? 'Select' : '...'}
                value={props.value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    props.onChange(item.value);
                    setIsFocus(false);
                }} >
            </Dropdown>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        backgroundColor: '#fff',
        alignItems: 'left',
        alignContent: 'left',
        width: '70%',
        marginTop: 16,
        height: 70,
        borderColor: 'red',
        //borderWidth: 1
    },
    dropdown: {
        width: 290,
        flex: 1,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    input: {
        fontSize: 14,
        fontWeight: "light",
        width: "100%",
        borderBottomWidth: 1.0
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        borderColor: 'blue',
        //borderWidth: 1,
        width: 290
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        flex: 1,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

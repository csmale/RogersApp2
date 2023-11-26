
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { useState } from 'react';

export default function MyDropdown(props) {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'left' }}>
                <Text style={styles.label}>{props.label}</Text>
            </View>
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
        backgroundColor: '#fff',
        alignItems: 'left',
        justifyContent: 'left',
        width: '50%',
        marginTop: 16
    },
    dropdown: {
        height: 30,
        width: 210,
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
        fontSize: 16,
        fontWeight: "bold"
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
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

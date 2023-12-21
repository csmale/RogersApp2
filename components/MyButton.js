import { StyleSheet, View, Button, Text, Pressable } from "react-native";

export default function MyButton(props) {
    const { onPress, caption='Save', disabled=false } = props;
    return (
        <Pressable style={disabled?styles.disabledbutton:styles.button} onPress={onPress} disabled={disabled}>
            <Text style={styles.text}>{caption}</Text>
        </Pressable>
    );
}

/*
                <Button
                    title={props.caption}
                    color="#f47c47"
                    onPress={props.onPress}
                />
*/

const styles = StyleSheet.create({
    container: {
        width: '75%',
        marginTop: 16,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: '#f47c47',
        width: '75%',
        marginTop: 16,
    },
    disabledbutton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: '#808080',
        width: '75%',
        marginTop: 16,
    },
    text: {
        fontSize: 20,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
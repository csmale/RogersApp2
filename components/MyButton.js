import { StyleSheet, View, Button, Pressable } from "react-native";

export default function MyButton(props) {
    // const { } = props;
    return (
        <View style={styles.container}>
            <Pressable>
                <Button style={styles.button}
                    title={props.caption}
                    color="#f47c47"
                    onPress={props.onPress}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '75%',
        marginTop: 16,
    },
    button: {
        fontSize: 14,
        fontWeight: "light",
    },
});
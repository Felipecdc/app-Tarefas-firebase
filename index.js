import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TaskList({data, deletItem, editItem}){
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={() => deletItem(data.key)}>
                <Feather name="trash" size={18} color={'#fff'}/>
            </TouchableOpacity>

            <View>
            <TouchableWithoutFeedback onPress={ () => editItem(data)}>
                <Text style={styles.text}>{data.nome}</Text>
            </TouchableWithoutFeedback>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#191919',
        marginTop: 10,
        padding: 10,
        borderRadius: 5
    },
    text:{
        color: '#fff',
        paddingLeft: 5
    }
})
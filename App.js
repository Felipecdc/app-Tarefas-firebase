import React, { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Login from './src/Components/Login';
import TaskList from "./src/Components/TaskList";
import firebase from "./src/services/firebase";


export default function App(){

    const inputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [key, setKey] = useState('');
    const [newtask, setNewtask] = useState('');
    
    useEffect( () => {

        function Getuser(){

            if(!user){
                return;
            }

            firebase.database().ref('tarefas').child(user).once( 'value', (snapshot) => {
                setTasks([]);

                snapshot?.forEach( (childItem) => {
                    let data = {
                        key: childItem.key,
                        nome: childItem.val().nome
                    }
                    setTasks( oldTasks => [...oldTasks, data])
                })
            })
        }

        Getuser();
        
    }, [user])

    function handleDelet(key){
        firebase.database().ref('tarefas').child(user).child(key).remove()
        .then( () => {
            const findTasks = tasks.filter( item => item.key !== key)
            setTasks(findTasks);
        })
        .catch( (error) => {
            console.log(error)
        })
    }

    function handleEdit(data){
        setKey(data.key);
        setNewtask(data.nome);
        inputRef.current.focus();
    }

    function CancelEdit(){
        setKey('');
        setNewtask('');
        Keyboard.dismiss();
    }

    function handleAdd(){
        if(newtask === ''){
            return;
        }

        if(key !== ''){
            firebase.database().ref('tarefas').child(user).child(key).update({
                nome: newtask
            })
            .then( () => {
                const findIndex = tasks.findIndex( item => item.key === key)
                const taskClone = tasks;
                taskClone[findIndex].nome = newtask;

                setTasks([...taskClone]);
            })

            Keyboard.dismiss();
            setNewtask('');
            setKey('');
            return;
        }

        let tarefas = firebase.database().ref('tarefas').child(user)
        let chave = tarefas.push().key;

        tarefas.child(chave).set({
            nome: newtask
        })
        .then( () => {
            const data = {
                key: chave,
                nome: newtask
            }

            setTasks(oldTasks => [...oldTasks, data])
        })
        
        setNewtask('');
        Keyboard.dismiss();

    }
  
    if(!user){
        return <Login changeStatus={ (user) => setUser(user)} />
    }

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar hidden />
            
            {key.length > 0 && (
                <View style={{flexDirection: 'row', marginBottom: 5, marginLeft: 5}}>
                    <TouchableOpacity onPress={CancelEdit}>
                        <Feather name="x-circle" size={18} color={'#ff0000'}/>
                    </TouchableOpacity>
                    <Text style={{color: '#ff0000', marginLeft: 5}}>Você está editando uma tarefa!</Text>
                </View>
            )}

            <View style={styles.areaInput}>

                <TextInput
                value={newtask}
                onChangeText={ (text) => setNewtask(text)}
                placeholder="Insira sua tarefa"
                style={styles.input}
                ref={inputRef}
                />

                <TouchableOpacity style={styles.btn} onPress={handleAdd}>
                    <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>+</Text>
                </TouchableOpacity>
            </View>

            <FlatList
            data={tasks}
            keyExtractor={ item => item.key }
            renderItem={ ({item}) => (
                <TaskList data={item} deletItem={handleDelet} editItem={handleEdit}/>
            )}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 25,
        paddingHorizontal: 12,
        backgroundColor:'#f2f6fc'
    },
    areaInput:{
        flexDirection: 'row'
    },
    input:{
        flex: 1,
        fontSize: 18,
        height: 45,
        borderWidth: 1,
        borderColor: '#181818',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
    },
    btn:{
        marginLeft: 5,
        paddingHorizontal: 15,
        backgroundColor: '#191919',
        justifyContent: 'center',
        borderRadius: 5
    }
})
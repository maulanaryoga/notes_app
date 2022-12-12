import React, { useState } from 'react'
import { SafeAreaView, FlatList, TouchableOpacity, Text, ActivityIndicator, TouchableHighlight, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../../components/SearchBar';
import Style from './styles';
import Colors from '../../styles/color';
import Notes from '../../components/RenderNotes';
import { useAuth } from "../../../contexts/AuthContext";
import style from './styles';

export default function Home({navigation}){
    const { logout } = useAuth();

    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            const getData = async () => {
                try {
                    let notes = await AsyncStorage.getItem('notes');
                    if(notes === undefined || notes === null){
                        notes = '[]';
                    }
                    if(notes.length > 0 && notes[0] !== '['){
                        notes = `[${notes}]`;
                    }
                    setData(JSON.parse(notes));
                    setLoading(false);
                }catch(err){
                    console.log(err);
                    alert('Error loading notes');
              }
            };
            getData();
        },
    []))
    if(loading){
        return(
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator size={'large'} color={Colors.loading}/>
            </View>
        )
    }else{
        return(
            <SafeAreaView style={Style.conteiner}>
                <Text style={Style.txtTitle}>NOTES</Text>
                <SearchBar data={data} onChange={setData}/>
                <FlatList
                    ListEmptyComponent={<Text style={{textAlign:'center'}}>Tidak ada</Text>}
                    showsVerticalScrollIndicator={false}
                    data={data}
                    numColumns={2}
                    columnWrapperStyle={Style.noteList}
                    keyExtractor={(item)=>item.id.toString()}
                    renderItem={({item})=>{
                        return(
                            <Notes item={item} navigation={navigation}/>
                        )
                    }}
                />
                <TouchableOpacity style={{
                     zIndex:9,
                     position:'absolute',
                     bottom:30,
                     right:40,
                     backgroundColor: '#fff',
                     borderRadius: 100,
                     shadowColor: "#000",
                     shadowOffset: {
                         width: 0,
                         height: 2,
                     },
                     shadowOpacity: 0.25,
                     shadowRadius: 3.84,
             
                     elevation: 5,
                }} onPress={()=>navigation.navigate('Notes',{search:false})}>
                    <AntDesign name="pluscircle" size={50} color={Colors.addButton}/>
                </TouchableOpacity>
                <TouchableHighlight 
                style={{
                    paddingBottom: 35,
                    paddingLeft: 30
                }}
                onPress={logout}>
                    <Text style={{
                        width: 100,
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: 'green',
                        textAlign: 'center',
                        borderRadius: 10,
                        borderWidth: 0,
                        borderColor: 'darkgreen',
                        paddingBottom: 5
                    }}>Logout</Text>
                </TouchableHighlight>
            </SafeAreaView>
        )
    }   
}

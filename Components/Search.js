import React from 'react'
import FilmItem from './FilmItem'
import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi'
import {StyleSheet, View, TextInput, Button, Text,FlatList } from 'react-native'

class Search extends React.Component{
  _searchTextInputChanged(text) {
    this.searchedText=text
  }
  _loadFilms() {
    if(this.searchedText.length >0){
      this.setState({isLoading : true})
      getFilmsFromApiWithSearchedText(this.searchedText).then(data => {
        this.setState({
          films : data.results,
          isLoading : False
        })
      })
    }
  }
  constructor(props){
    super(props)
    this.searchedText= ""
    this.state = {
      films : [],
      isLoading : false
    }
  }
  render(){
    return (
      <View style={styles.main_container}>
        <TextInput style={styles.textinput}
          placeholder='Titre du film'
          onChangeText={(text)=> this._searchTextInputChanged(text)}
          onSubmitEditing ={()=> this._loadFilms()}
        />
        <Button title='Recherche' onPress={() => this._loadFilms()}/>
        <FlatList
          data={this.state.films}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => <FilmItem film={item}/>}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginTop: 50,
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  }
})

export default Search

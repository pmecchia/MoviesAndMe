import React from 'react'
import FilmItem from './FilmItem'
import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi'
import {StyleSheet, View, TextInput, Button, Text,FlatList, ActivityIndicator } from 'react-native'

class Search extends React.Component{
  _displayDetailForFilm = (idFilm) => {
    this.props.navigation.navigate("FilmDetail", {idFilm:idFilm})
  }

  _searchFilms(){
    this.page = 0
    this.total_pages = 0
    this.setState({
      films:[],
    }, () => {
      this._loadFilms()
    })
  }
  _displayLoading() {
    if(this.state.isLoading){
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }
  }
  _searchTextInputChanged(text) {
    this.searchedText=text
  }
  _loadFilms() {
    if(this.searchedText.length >0){
      this.setState({isLoading : true})
      getFilmsFromApiWithSearchedText(this.searchedText,this.page+1).then(data => {
        this.page = data.page
        this.total_pages = data.total_pages
        this.setState({
          films : [...this.state.films, ...data.results],
          isLoading : false
        })
      })
    }
  }
  constructor(props){
    super(props)
    this.searchedText= ""
    this.page=0
    this.total_pages=0
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
          onSubmitEditing ={()=> this._searchFilms()}
        />
        <Button title='Recherche' onPress={() => this._searchFilms()}/>
        <FlatList
          data={this.state.films}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => <FilmItem film={item} displayDetailForFilm = {this._displayDetailForFilm}/>}
          onEndReachedThreshold = {0.5}
          onEndReached={()=> {
            if (this.page < this.total_pages) {
              this._loadFilms()
            }
          }}
        />
        {this._displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  },
  loading_container: {
    position : 'absolute',
    left : 0,
    right : 0,
    bottom : 0,
    top : 200,
    justifyContent : 'center',
    alignItems : 'center'
  }
})

export default Search

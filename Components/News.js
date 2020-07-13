import React from 'react'
import FilmList from './FilmList'
import {getBestFilm} from '../API/TMDBApi'
import {StyleSheet, View, Text,FlatList, ActivityIndicator } from 'react-native'


class News extends React.Component{

  constructor(props){
    super(props)
    this.page=0
    this.total_pages=0
    this.state = {
      films : [],
      isLoading : false
    }
    this._loadFilms = this._loadFilms.bind(this)
  }

  componentDidMount(){
    this._loadFilms()
  }

  _loadFilms() {
    this.setState({isLoading : true})
    getBestFilm(this.page+1).then(data => {
      this.page = data.page
      this.total_pages = data.total_pages
      this.setState({
        films : [...this.state.films, ...data.results],
        isLoading : false
      })
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

  render(){
    return(
      <View style={styles.main_container}>
        <FilmList
          films={this.state.films}
          navigation={this.props.navigation}
          loadFilms={this._loadFilms}
          page={this.page}
          total_pages={this.total_pages}
          favoriteList={false}
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

export default News

import React from 'react'
import {Text, View, StyleSheet,ActivityIndicator, ScrollView, Image, TouchableOpacity} from 'react-native'
import {getFilmDetailFromApi, getImageFromApi} from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import {connect} from 'react-redux'

class FilmDetail extends React.Component{

  constructor(props){
    super(props)
    this.state={
      film : undefined,
      isLoading : true
    }
  }

  _toggleFavorite(){
    const action = { type: "TOGGLE_FAVORITE", value: this.state.film}
    this.props.dispatch(action)
  }

  componentDidMount(){
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film : data,
        isLoading : false
      })
    })
  }

  componentDidUpdate(){
    console.log("componentDidUpdate:")
    console.log(this.props.favoritesFilm)
  }

  _displayFavoriteImage(){
    var sourceImage = require('../Images/ic_favorite_border.png')
    if(this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1){
      sourceImage = require('../Images/ic_favorite.png')
    }
    return(
      <Image
        source={sourceImage}
        style={styles.favorite_image}
      />
    )
  }


  _displayLoading(){
    if (this.state.isLoading){
      return(
        <View style={styles.loading_container}>
          <ActivityIndicator size='large'/>
        </View>
      )
    }
  }
  _displayFilm(){
    if (this.state.film != undefined){
      return(
        <ScrollView style={styles.scrollview_container}>
          <Image
              source={{uri: getImageFromApi(this.state.film.backdrop_path)}}
              style={styles.image}
          />
          <Text style={styles.title_text}>{this.state.film.title}</Text>
          <TouchableOpacity
            style={styles.favorite_container}
            onPress={()=> this._toggleFavorite()}>
            {this._displayFavoriteImage()}
          </TouchableOpacity>
          <Text style={styles.description_text}>{this.state.film.overview}</Text>
          <Text style={styles.data_text}>Sortie le {moment(new Date(this.state.release_date)).format('DD/MM/YYYY')}</Text>
          <Text style={styles.data_text}>Note: {this.state.film.vote_average}/10</Text>
          <Text style={styles.data_text}>Nombre de votes: {this.state.film.vote_count}</Text>
          <Text style={styles.data_text}>Budget: {numeral(this.state.film.budget).format('0,0[.]00$')} </Text>
          <Text style={styles.data_text}>Genre(s): {this.state.film.genres.map(function(genre){return genre.name;}).join(" / ")}</Text>
          <Text style={styles.data_text}>Companie(s): {this.state.film.production_companies.map(function(companies){return companies.name;}).join(" / ")}</Text>
        </ScrollView>
      )
    }
  }
  render(){
    return(
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
      </View>
    )
  }
}

const styles = StyleSheet.create({

  favorite_image:{
    height : 40,
    width  : 40
  },
  favorite_container :{
    alignItems: 'center'
  },

  image:{
    height:180,
    margin: 5

  },
  title_text:{
    flex : 1,
    textAlign : 'center',
    fontWeight : 'bold',
    fontSize : 30,
    color : '#000000',
    margin: 5,
    marginBottom : 10
  },
  description_text:{
    flex : 3,
    textAlign : 'left',
    fontStyle : 'italic',
    color : '#666666',
    margin: 5,
    marginBottom : 10
  },
  data_text:{
    marginLeft: 5,
    marginRight: 5,
    marginBottom : 5,
    fontWeight : 'bold'
  },
  scrollview_container:{
    flex :1,
    flexDirection:'column'
  },
  loading_container:{
    position : 'absolute',
    top : 0,
    bottom : 0,
    left: 0,
    right: 0,
    alignItems : 'center',
    justifyContent : 'center'

  },

  main_container:{
    flex :1
  }
})

const mapStateToProps = (state) =>{
  return {
    favoritesFilm : state.favoritesFilm
  }
}


export default connect(mapStateToProps)(FilmDetail)

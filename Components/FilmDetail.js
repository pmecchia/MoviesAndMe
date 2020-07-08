import React from 'react'
import {Text, View, StyleSheet,ActivityIndicator, ScrollView, Image, TouchableOpacity, Share, Platform} from 'react-native'
import {getFilmDetailFromApi, getImageFromApi} from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import {connect} from 'react-redux'
import EnlargeShrink from '../Animations/EnlargeShrink'

class FilmDetail extends React.Component{

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
    if (params.film != undefined && Platform.OS === 'ios'){
      return{
        headerRight: <TouchableOpacity
                        style={styles.share_touchable_headerrightbutton}
                        onPress = {()=> params.shareFilm()}>
                        <Image
                          style={styles.share_image}
                          source={require('../Images/ic_share.png')}
                        />
                      </TouchableOpacity>
      }
    }
  }

  constructor(props){
    super(props)
    this.state={
      film : undefined,
      isLoading : true
    }
    // Ne pas oublier de binder la fonction _shareFilm sinon,
    //lorsqu'on va l'appeler depuis le headerRight de la navigation,
    //this.state.film sera undefined et fera planter l'application
    this._shareFilm = this._shareFilm.bind(this)
  }

  _toggleFavorite(){
    const action = { type: "TOGGLE_FAVORITE", value: this.state.film}
    this.props.dispatch(action)
  }

  componentDidMount(){
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
    if (favoriteFilmIndex !== -1){ // film déjà dans les fav donc on possède son détail stocké dans notre state global au state de notre component
        this.setState({
          film : this.props.favoritesFilm[favoriteFilmIndex],
          isLoading : false
        }, () => {this._updateNavigationParams()}) // Dès que le film est chargé, on met à jour les paramètres de la navigation
                                                   //pour afficher le bouton de partage
        return
    }

     //film pas dans les fav on fait appel à l'api pour récupérer le détail
    this.setState({
      isLoading: true
    })
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film : data,
        isLoading : false
      }, () => {this._updateNavigationParams()})
    })
  }

  componentDidUpdate(){
    console.log("componentDidUpdate:")
    console.log(this.props.favoritesFilm)
  }
  // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation.
  // Ainsi on aura accès à ces données au moment de définir le headerRight
  _updateNavigationParams(){
    this.props.navigation.setParams({
      shareFilm: this._shareFilm,
      film : this.state.film
    })
  }

  _shareFilm(){
    const { film } = this.state
    Share.share({title: film.title, message: film.overview})
  }

  _displayFloatingActionButton(){
    const { film } = this.state
    if(film != undefined && Platform.OS === ' android'){ //uniquement sur android lorsque le film est chargé
      return(
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress = {()=> this._shareFilm()}>
          <Image
            style={styles.share_image}
            source={require('../Images/ic_share.png')}
          />
        </TouchableOpacity>
      )
    }
  }

  _displayFavoriteImage(){
    var sourceImage = require('../Images/ic_favorite_border.png')
    var shouldEnlarge = false
    if(this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1){
      sourceImage = require('../Images/ic_favorite.png')
      shouldEnlarge = true
    }
    return(
      <EnlargeShrink shouldEnlarge={shouldEnlarge}>
        <Image
          source={sourceImage}
          style={styles.favorite_image}
        />
      </EnlargeShrink>
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
        {this._displayFloatingActionButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  share_touchable_headerrightbutton: {
    marginRight: 8
  },
  share_touchable_floatingactionbutton:{
    position: 'absolute',
    width: 60,
    height: 60,
    right: 30,
    bottom: 30,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center'
  },
  share_image: {
    height: 30,
    width : 30
  },
  favorite_image:{
    flex : 1,
    height : null,
    width  : null
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
    flexWrap: 'wrap',
    textAlign : 'center',
    fontWeight : 'bold',
    fontSize : 30,
    color : '#000000',
    margin: 5,
    marginBottom : 10
  },
  description_text:{
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

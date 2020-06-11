import React from 'react'
import {Text, View, StyleSheet} from 'react-native'

class FilmDetail extends React.Component{
  render(){
    return(
      <View style={styles.main_container}>
        <Text>Details films {this.props.navigation.state.params.idFilm}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  main_container:{
    flex :1
  }
})

export default FilmDetail

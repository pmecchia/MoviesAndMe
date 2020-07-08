import React from 'react'
import {Animated} from 'react-native'

class EnlargeShrink extends React.Component{
  constructor(props){
    super(props)
    this.state={
      viewSize: new Animated.Value(this._getSize())
    }
  }

  // La méthode componentDidUpdate est exécuté chaque fois que le component est mise à jour,
  //c'est l'endroit parfait pour lancer / relancer notre animation.
  componentDidUpdate(){
    Animated.spring(
      this.state.viewSize,
      {
        toValue: this._getSize()
      }
    ).start()

  }

  _getSize(){
    if(this.props.shouldEnlarge){
      return 80
    }
    return 40
  }

  render(){
    return(
      <Animated.View style={{height: this.state.viewSize, width: this.state.viewSize}}>
        {this.props.children}
      </Animated.View>
    )
  }

}

export default EnlargeShrink

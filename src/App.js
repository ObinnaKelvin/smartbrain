import React, {Component} from 'react';
//import logo from './logo.svg';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
//import Clarifai from 'clarifai';
//It's a security risk to have Clarifai on the front end cos
//the api key could be fetched out from the 'developer tools'
//part of google chrome. This means that if you paid for the key,
// a hacker could use your API and load it with tons of request.
//This simply means you're gonna pay a hell of money. It's best practice 
//to take the Clarifai API to the backend(which means installing it on 'smartbrainapi' 
// and 'require' it on 'image.js' in controllers folder in this project).

import FaceRecognition from './components/FaceRecognition/FaceRecognition';

// const app = new Clarifai.App({
//  apiKey: '1b2e7d33c0ed401eba5a015ad93e66c9'
// });
//The api has been moved to 'image.js' under controllers

const particlesOptions = {
                particles: {
                  number: {
                    value: 80,
                    density: {
                      enable: true,
                      value_area: 800
                    }
                  }
                }
}

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState( {user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  } 

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image =document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    //console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000/')
  //     .then(response => response.json())
  //     .then(data => console.log(data)); // or .then(console.log)
  // }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => { 
      this.setState({imageUrl: this.state.input});
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(err => console.log("API Error Catch: ", err));
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      }) 
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      .catch(err => console.log(err));
  }


  onRouteChange = (route) => {
    if(route === 'signin'){
      this.setState(initialState)
      //this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){


    //Cleaner Code!!
    // const {isSignedIn, imageUrl, route, box} = this.state;

    //replace the following
    //example:this.state.isSignedIn to become isSignedIn

    return (
      <div className="App">
        <Particles className = 'particles' 
                params={particlesOptions}
        />
        <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank name ={this.state.user.name} entries = {this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          : (
              this.state.route === 'signin'
              ? <Signin loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
              : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
            )

          
        }
      </div>
    );
  }
  
}

export default App;

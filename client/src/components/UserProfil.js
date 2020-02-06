import React, { Component } from 'react'
import { Alert, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import axios from "axios"


export default class UserProfil extends Component {
  constructor(props){
    super(props);
    this.state={
      username: this.props.user.username,
      avatarUrl: this.props.user.avatarURL,
      email: this.props.user.email,
      usertype: this.props.user.userType
    }
  }

  getUserProfile = () =>
  {
    axios.get(`/api/usereditor/${this.props.user._id}`)
    .then(res =>{
      console.log(res.data.avatarURL)
      this.setState({avatarURL: res.data.avatarURL})
    })
  }


  componentDidMount() 
  {this.getUserProfile()}

  render() {
  
    return (
      <div className="UserProfil">
        <img src={this.state.avatarURL} alt="userbild" />
        <Link to="/usereditor">Edit Avatar <FontAwesomeIcon icon="user-edit" /></Link>
        <h1>{this.state.username}</h1>
        <h1>{this.state.email}</h1>
        <h1>{this.state.usertype}</h1>
      </div>
    )
  }
}

import React, { Component } from 'react'
import axios from "axios";


export default class Guestbook extends Component {
  constructor(props){
    super(props);
    this.state={
      visibility: false,
      guestbook: [],
      entrie: "",
      title: "",
      showGuestbook: false
    }
  }

  showGuestbookEntry=()=>{
    this.setState({
      visibility: !this.state.visibility
    })
  }

  showAllEntries=()=>{
    axios.get("/api/guestbook")
    .then(response=>{
      this.setState({
        guestbook: response.data
      })
    })
  }

  componentDidMount(){
    this.showAllEntries();
  }

  addEntrie=(event)=>{
    this.setState({[event.target.name] : event.target.value})
  }
  
  createEntrie=(event)=>{
    
    event.preventDefault();
    axios.post("/api/guestbook/create", {title: this.state.title, entrie: this.state.entrie, user: this.props.user._id})
    .then(response => {
     
      this.setState({
        entrie: "",
        title: "",
        visibility: false
      });
  }).then(res=>this.showAllEntries())
  
}


  render() {
        
        return (
      <div className="guestBook-Align">
      <button onClick={this.showGuestbookEntry}>Add Guestbook entry</button>
      <div>
      {
          this.state.visibility ? 
          <form onSubmit={this.createEntrie}>
          <div>
          <label>Titel <input type="text" name="title" value={this.state.title} onChange={this.addEntrie} /></label>
          <label>Eintrag <textarea cols="100" rows="5" name="entrie" value={this.state.entrie} onChange={this.addEntrie}></textarea></label></div>
          <button type="submit">Posten</button>
        </form> :
          null
        }
    </div>
    {this.state.guestbook.map(oneEntrie=>{
      return <div className="guestbook" key={oneEntrie._id}><div className="guestBookUser"><img style={{width: "50px"}} src={oneEntrie.user.avatarURL} alt="bild" /><p>{oneEntrie.user.username}</p></div><div><h1>{oneEntrie.title}</h1><p>{oneEntrie.entrie}</p></div></div>
  })}
        
        
        
      </div>
      )
    }

  
}

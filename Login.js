import React from 'react';
import fire from '../config/fire'
class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state={
            username:'',
            password:'',
            user:null,
            message:'',
            chat:[],
            loginpage:true
        
        }
    }
    authListener=()=>{
        fire.auth().onAuthStateChanged((user)=>{
            if(user)
            {
                console.log(user.email);
                this.setState({user:user});
            }
            else
            {
                this.setState({user:null});
            }

        })
    }
    componentDidMount=()=>{
        this.authListener();
        fire.database().ref().child('message').on('value',snapshot=>{
            console.log('there is a new message');
            if(snapshot.val() !=null)
            {
                this.setState({chat:{...snapshot.val()}});
                console.log(this.state);
                let interval = window.setInterval(function(){
                    var elem=document.getElementById('chatt');
                    elem.scrollTop = elem.scrollHeight;
                   window.clearInterval(interval);
                 },1000)
                 
                this.forceUpdate();
            }
        });
    }
    handleChange=(e)=>{
        this.setState({[e.target.name]:e.target.value});
        console.log(this.state);

    }
    handleLogin=(e)=>{
        e.preventDefault();
        if(this.state.username!='' && this.state.password!='')
        {
            fire.auth().signInWithEmailAndPassword(this.state.username,this.state.password).then((u)=>{
                console.log(u);
            }).catch(err=>{
                console.log(err);
            })
        }

    }
    addmsg =(obj)=>{
        fire.database().ref().child('message').push(
            obj,
            err=>{
                if(err)
                {
                    console.log(err);
                }
            }
        )
    }
    sendmsg = (e) =>{
        console.log('send');
        var ob={username: this.state.user.email, message:this.state.message};
        this.addmsg(ob);
        this.setState({message:''});
        console.log(this.state);
        let interval = window.setInterval(function(){
            var elem=document.getElementById('chatt');
            elem.scrollTop = elem.scrollHeight;
            window.clearInterval(interval);
        },1000 )
    }
    handleSignout=(e)=>{
        fire.auth().signOut();
    }
    render()
    {
        return (
          
              this.state.user==null ? <div>
                  <from style={{width:'60%', marginLeft:'20%', marginTop:'2%'}}>
                      <div class="form-group">
                          <label style={{fontFamily:'cursive'}} for="email">Email Address:</label>
                          <input id="email" required onChange={this.handleChange} value={this.state.username} class="form-control" name="username" type="email"/>
                      </div>
                      <div class="form-group">
                          <label style={{fontFamily:'cursive'}} for="pwd">Password:</label>
                          <input type="password" class="form-control" onChange={this.handleChange} value={this.state.password} name="password" id="pwd" required/>
                      </div>
                      <div>
                          <button class="btn btn-primary" onClick={this.handleLogin} style={{width:'250px',marginLeft:'10px'}}>Login</button>
                      </div>

                  </from>

              </div> : <div style={{width:'100%',height:'100vh',color:'black'}}>
                  <div>
                  <header style={{display:'flex',height:'60px',width:'100%',color:'white',backgroundColor:'green'}}><h1 style={{fontFamily:'cursive'}}>chatapp</h1><button onClick={this.handleSignout} style={{marginLeft:'auto'}} class="btn btn-warning">Sign Out</button></header>
                  
                  </div>
                 <div id="chatt" style={{marginLeft:'50px',scrollBehavior:'smooth',overflow:'scroll',width:'100%',height:'80%'}}>
                 {
                      Object.keys(this.state.chat).map(id=>{
                          if(this.state.user.email==this.state.chat[id].username)
                          {
                            return <div style={{color:'white',marginLeft:'100px',borderRadius:'100px',width:'50%',flexWrap:'wrap',backgroundColor:'blue',marginBottom:'5px',padding:'20px',float:'right',position:'relative',display:'block'}} key={id}>
                            <small style={{fontSize:'12px',fontFamily:'cursive'}}>{this.state.chat[id].username}</small>
                            <h5 style={{fontSize:'20px',fontFamily:'cursive'}}>{this.state.chat[id].message}</h5>
                            </div>
                           }
                           else{
                            return <div style={{marginBottom:'5px',padding:'10px',color:'white',backgroundColor:'black',flexWrap:'wrap',marginRight:'100px',float:'left',width:'50%',borderRadius:'100px'}} key={id}>
                            <small style={{fontSize:'12px',fontFamily:'cursive'}}>{this.state.chat[id].username}</small>
                            <h5 style={{fontSize:'20px',fontFamily:'cursive'}}>{this.state.chat[id].message}</h5>
                            </div>
                           }
                         
                      })
                  }
                 </div>
                  <footer style={{marginLeft:'50px'}}>
                      <input style={{width:'80%',float:'left'}} type="text" class="form-control" onChange={this.handleChange} name="message" value={this.state.message}/>
                      <button style={{width:'10%'}} onClick={this.sendmsg} class="btn btn-primary">Send</button>

                  </footer>
                  

              </div>
                  
        );
    }
}
export default Login; //end of program
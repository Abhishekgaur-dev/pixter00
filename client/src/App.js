import React,{useEffect,createContext,useReducer,useContext} from 'react';

import {Switch,Route,BrowserRouter, useHistory} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Profile from './components/Profile'
import CreatePost from './components/CreatePost';
import UserProfile from './components/UserProfile';

import { toast } from 'react-toastify';
import {reducer,initialState} from './reducer/userReducer'
import SubscribedUserPost from './components/SubscribedUserPost';



toast.configure({
  closeButton:false,
  hideProgressBar:true,
  draggable:false,
  autoClose:3000
})

export const userContext = createContext()


const Routing = ()=>{

  const history = useHistory()
  const {state,dispatch} = useContext(userContext)
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER",payload:user})
      history.push('/')
      
    }
    else{
      history.push("/signin")
    }
  },[])
  
  return (
    <Switch>      
      <Route exact path="/" component={Home} />
      <Route  path="/signup" component={Signup} />
      <Route  path="/signin" component={Signin} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/createpost" component={CreatePost} />
      <Route path= "/profile/:userid" component={UserProfile} />
      <Route path= "/myfollowingposts" component={SubscribedUserPost} />
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  
  return (
   
   <userContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing />

    </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;

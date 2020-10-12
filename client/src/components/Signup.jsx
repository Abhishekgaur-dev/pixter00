import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



function Signup() {
    const history = useHistory()
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    const [label,setlabel] = useState("upload profile pic") 
    
    useEffect(() => {
        if(url){
            uploadfields()
        }
       
    }, [url]);

    const uploadpic = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta_clone")
        data.append("cloud_name","lunner")
        
        fetch("	https://api.cloudinary.com/v1_1/lunner/image/upload",{
            
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        }).catch(err=>
            {
                console.log(err)
            })
    }

    const uploadfields = ()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data =>{
            if(data.error){
               toast.error(data.error) 
            }
            else {
                toast.success(data.message)
                history.push('/signin')
               }
            
        }).catch(err=>{
            console.log(err)
        })
    }

    const postData = (e) => {

        if(image){
            uploadpic()
        }
        else{
            uploadfields()
        }
        e.preventDefault()
    }


    return (

    <div className="signup d-flex justify-content-center align-items-center">
        
        <div className=" signup_style">
           <form onSubmit={(e)=> postData(e)} method ="post">
                <div className="mb-3">
                    <label for="exampleInputName1" className="form-label">Name</label>
                    <input 
                    type="text" 
                    className="form-control" 
                    id="exampleInputName"
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}}
                    />
                </div>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email address</label>
                    <input 
                    type="email" 
                    className="form-control" 
                    id="exampleInputEmail1" 
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    />
                </div>

                 <div className="form-file form-file-sm mb-2">
                    <input type="file" className="form-file-input file_input" 
                    id="customFileSm" 
                    onChange={(e)=>{
                        setlabel(e.target.files[0].name)
                         setImage(e.target.files[0])
                    }}/>
                    <label className="form-file-label"> 
                        <span className="form-file-text">{label}</span>
                        <span className="form-file-button">Image</span>
                    </label>
                </div>

                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input 
                    type="password" 
                    className="form-control" 
                    id="exampleInputPassword1"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    />
                </div>
                
                <button type="submit" className="btn btn-primary">Signup</button>
                <br/>

                <div className="d-flex">
                    <h5>Already have an account?</h5>
                    <span className="ml-1">
                        <Link to="/signin">Login</Link>
                    </span>
                  </div>
                
                </form>
        </div>
    </div>
    )
}

export default Signup

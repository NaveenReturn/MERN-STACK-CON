import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/userActions";
import { clearAuther} from '../../actions/userActions';
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";

export default function Register(){
   const [userDate,setUserData] = useState({
          name:"",
          email:"",
          password:""                         
   });
   const [avatar,setavatar] = useState("");
   const [avatarPreview,setAvatarPreview] = useState("/images/default_avatar.jpg");
   const dispatch = useDispatch()
   const navigate = useNavigate();
   const {loading,error,isAuthenticated} = useSelector(state => state.authState);

   const onChange = (e)=>{
          if(e.target.name === 'avatar'){
            const reader = new FileReader;
            reader.onload = ()=>{
                 if(reader.readyState === 2){
                     setAvatarPreview(reader.result)             
                     setavatar(e.target.files[0])              
                 }                  
            }

            reader.readAsDataURL(e.target.files[0])                    
          }else{                         
         
          setUserData({...userDate, [e.target.name]:e.target.value})
          console.log('REGISTER FORM FILET:',userDate)  
          }                        
   }

   const submitHandler = (e)=>{
         e.preventDefault();
         const formData = new FormData();
         formData.append('name',userDate.name)
         formData.append('email',userDate.email)
         formData.append('password',userDate.password)
         formData.append('avatar',avatar)
         dispatch(register(formData))

   }

    useEffect(()=>{
         if(isAuthenticated){
             navigate('/');
             return                      
         }

       if(error){
         toast(error,{
              position:toast.POSITION.BOTTOM_CENTER,
              type:'error',
              onOpen:()=>{dispatch(clearAuther)}                     
         })
         return
       }

    },[error,isAuthenticated])

     return(
        <div className="row wrapper">
    <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
            <h1 className="mb-3">Register</h1>

          <div className="form-group">
            <label htmlFor="name_field">Name</label>
            <input type="name" name="name" onChange={onChange} id="name_field" className="form-control"  />
          </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                name="email"
                onChange={onChange}
                id="email_field"
                className="form-control"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                name="password"
                onChange={onChange}
                className="form-control"
              />
            </div>

            <div className='form-group'>
              <label htmlFor='avatar_upload'>Avatar</label>
              <div className='d-flex align-items-center'>
                  <div>
                      <figure className='avatar mr-3 item-rtl'>
                          <img
                              src={avatarPreview}
                              className='rounded-circle'
                              alt='image'
                          />
                      </figure>
                  </div>
                  <div className='custom-file'>
                      <input
                          type='file'
                          name='avatar'
                          onChange={onChange}
                          className='custom-file-input'
                          id='customFile'
                      />
                      <label className='custom-file-label' htmlFor='customFile'>
                          Choose Avatar
                      </label>
                  </div>
              </div>
          </div>
  
            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              REGISTER
            </button>
          </form>
      </div>
    </div>                                    
     )                              
}
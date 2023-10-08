import React from 'react';
import Search from './Search';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function Header (){
         
      const {isAuthenticated,user} = useSelector((state) => state.authState);

      return(
 <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to="/">
          <img width="150px" src="/images/logo.png" alt='DEEPAcart' />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
            <Search/>  
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">

        {isAuthenticated ? 'LoggedIn' :
       <Link  to="/login"> <button className="btn" id="login_btn">Login</button></Link>
     }   
        <span id="cart" className="ml-3">Cart</span>
        <span className="ml-1" id="cart_count">2</span>
      </div>
    </nav>                           
      )                             
}
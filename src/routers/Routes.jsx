import React, { useEffect, useState } from "react";
import firebase from 'firebase'
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import Home from "../containers/Home.jsx";
import Ofertas from "../containers/Ofertas";
import Login from "../components/Login.jsx";
import PersistentDrawerRight from "../components/Header2";
import Header from "../components/Header";
import Registro from "../components/Registro.jsx";

import { login } from '../actions/auth'
import { useDispatch } from 'react-redux'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import AuthRouter from './AuthRouter'
import Perfil from '../components/Perfil.jsx'
import PublicarContenido from "../containers/PublicarContenido.jsx";
import { loadContent } from "../helpers/loadContent";
import { setContent, startGetContent } from "../actions/content.jsx";


export default function Routes() {

  const [checking, setChecking] = useState(true)
  const [isLoogedIn, setsIsLoogedIn] = useState(false)
  const dispatch = useDispatch();

  // Se inspecciona para saber si esta autenticado el usuario
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      console.log(user);
      if (user?.uid) {
        dispatch(login(user.uid, user.displayName))
        setsIsLoogedIn(true)

        dispatch(startGetContent())

      } else {
        setsIsLoogedIn(false)
      }

      setChecking(false)
    })

  }, [dispatch, setChecking])
  if (checking) {
    return (

      <h1>Cargando....</h1>
    )
  }


  // Note: La privada permite consumir toda la información sin la autenticación. 


  return (
    <div>
      <Router>
        {/* <Header /> */}
        <Switch>
          <Route exact path='/' component={Home} />
          <PublicRoute path="/auth" component={AuthRouter} isAuthenticated={isLoogedIn} />
          <PrivateRoute exact path="/perfil" component={Perfil} isAuthenticated={isLoogedIn} />
          {/* <Route  exact path = '/login' component = {Login}/>
        <Route exact path = '/home' component = {Home}/> */}
          {/* <Route exact path="/registro" component={Registro} /> */}
          <Route  path="/ofertas" component={Ofertas} />
          <Route  path="/publicar" component={PublicarContenido} />
          {/* <Redirect to="/auth/login" /> */}
          {/* <Redirect to="/auth/login" /> */}
          <Redirect to='/' />
        </Switch>
      </Router>
    </div>
  );
}
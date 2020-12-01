//Global plugins and services
import React, { useContext, useEffect } from 'react';
// import { Router } from '@reach/router';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Custom plugins and services
import { AuthProvider, store } from './contexts/AuthContext';
import './components/css/global.css';

//Custom components
import Home from './components/pages/Home';
import NotFound from './components/pages/NotFound';
import Note from './components/pages/Note';
import UserNotes from './components/pages/UserNotes';
import Edit from './components/pages/Edit';
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import Oauth from './components/pages/Oauth';
import ShareNote from './components/pages/ShareNote';
import SignOut from './components/pages/SignOut';
import Delete from './components/pages/Delete';
import Create from './components/pages/Create';

const Dom = () => {
    // restore current user
    const authMemo = useContext(store);

    useEffect(() => {
        authMemo.restoreToken();
    }, [authMemo]);

    return (
        <Router>
            <Switch>
                <Route path="/notes/create">
                    <Create />
                </Route>
                <Route path="/users/:id/notes">
                    <UserNotes />
                </Route>
                <Route path="/notes/:uid/edit">
                    <Edit />
                </Route>
                <Route path="/notes/:uid/share">
                    <ShareNote />
                </Route>
                <Route path="/notes/:uid/delete">
                    <Delete />
                </Route>
                <Route path="/notes/:uid">
                    <Note />
                </Route>

                <Route path="/sign-up">
                    <SignUp />
                </Route>
                <Route path="/sign-in">
                    <SignIn />
                </Route>
                <Route path="/sign-out">
                    <SignOut />
                </Route>
                <Route path="/oauth-callback">
                    <Oauth />
                </Route>
                <Route exact={true} path="/">
                    <Home />
                </Route>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Dom />
        </AuthProvider>
    );
};

export default App;

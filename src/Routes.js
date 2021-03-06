import React from "react";
import {Route, Switch} from "react-router-dom";
import NotFound from "./containers/NotFound";
import Home from "./containers/Home";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import Signup from "./containers/Signup";
import NewPost from "./containers/NewPost";
import Post from "./containers/Posts";

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps}/>
        <AppliedRoute path="/login" exact component={Login} props={childProps}/>
        <AppliedRoute path="/signup" exact component={Signup} props={childProps}/>
        <AppliedRoute path="/posts/new" exact component={NewPost} props={childProps}/>
        <AppliedRoute path="/posts/:id" exact component={Post} props={childProps}/>
        <AppliedRoute path="/category/:category" exact component={Home} props={childProps}/>

        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound}/>
    </Switch>;

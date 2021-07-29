import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

function App()
{
    return (
        <Switch>
            <Route path="">
                <div>main</div>
            </Route>
        </Switch>
    )
}

ReactDOM.render(
    <Router>
        <App/>
    </Router>,
    document.getElementById('root')
)
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Provider from '../Provider'
import Launches from './Launches'
import Rockets from './Rockets'
import UpComingLaunches from './UpComingLaunches'
import GetLaunchById from './GetLaunchById'
import GetRocketById from './GetRocketById'
import Users from './Users'
import UserForm from './UserForm'

export default function Home() {
  return (
    <Router>
      <Provider>
        <Switch>
          <Route exact path='/' component={UpComingLaunches}></Route>
          <Route exact path='/launches' component={Launches}></Route>
          <Route exact path='/rockets' component={Rockets}></Route>
          <Route exact path='/users' component={Users}></Route>
          <Route exact path='/users/create' component={UserForm}></Route>
          <Route exact path='/users/:userId/edit' component={UserForm}></Route>
          <Route exact path='/rockets/:rocketId' component={GetRocketById}></Route>
          <Route exact path='/launches/:launchId' component={GetLaunchById}></Route>
        </Switch>
      </Provider>
    </Router>
  )
}
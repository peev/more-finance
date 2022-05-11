import '../../App.css';
import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { init } from './Actions'
import Vaults from '../vaults/Vaults';
import Stake from '../stake/Stake';
import Header from '../../common/Header';
import Navigator from '../../common/Navigator';
import Notification from '../../common/Notification/Notification';
import Convert from '../../common/Convert/Convert';
import { ConvertRef } from '../../utils/AllRefs';

function showModal() {
  ConvertRef.current.showModal()
}

function Content(props) {
  return (
    <div className="Fixed-Container App-Container">
      <Navigator showModal={showModal} />
      {props.children}
    </div>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/stake">
        <Stake />
      </Route>
      <Route path="/home">
        <Vaults />
      </Route>
    </Switch>
  )
}

function Application(props) {

  useEffect(() => {
    props.init()
  }, [])

  return (
    <>
      <Header />
      <Notification />
      <Content>
        <AppRoutes />
      </Content>
      <Convert ref={ConvertRef} />
    </>
  )
}

// const mapStateToProps = ({ session }) => {
//   console.log('session', session)
//   return {
//     address: session.wallet
//   }
// }

export default connect(null, { init })(Application)
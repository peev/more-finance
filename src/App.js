import './App.css';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './routes/landing/landing';
import LandingHeader from './common/LandingHeader';
import Application from './routes/application/Application';
import configureStore from './store/configureStore';

const store = configureStore()

function LandingPage() {
  return (
    <>
      <LandingHeader />
      <Landing />
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact>
              <LandingPage />
            </Route>
            <Route>
              <Application />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;


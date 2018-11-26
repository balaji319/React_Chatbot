import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Header from './Header'
import Chatbot from './chatbot/Chatbot'
import Landing from '../components/pages/Landing'
import About from '../components/pages/About'
import Shop from '../components/shops/Shop'

const App = () => {
    return (
        <div className="container">
            <BrowserRouter>
                <div>
                <Header />
                    <Route exact path="/" component={Landing} />
                    <Route path="/shop" component={Shop} />
                    <Route path="/about" component={About} />
                    <Chatbot />
                </div>

            </BrowserRouter>
        </div>
    )
}


export default App;
import React from 'react';
import {Link} from 'react-router';

class HomePage extends React.Component {
    render() {
        return (
            <div className="jumbotron">
                <h1>Pluralsight Admnistration</h1>
                <p>React, Redux</p>
                <Link to="about" className="btn btn-primary btn-lng">Learn More</Link>
            </div>
        );
    }
}

export default HomePage;

import React from 'react';
import AppleAuth from './authentication/AppleAuth';
import GoogleAuth from './authentication/GoogleAuth';

const Home = () => {
    return (
        <View>
            <GoogleAuth />
            <AppleAuth />
        </View>
    )
};

export default Home;
import React from 'react';
import './Login.css'; // Assuming you have a CSS file for styles

function Login() {
    const login = () => {
        // Implement login logic here, such as redirecting to a GitLab OAuth page
    };

    return (
        <div className="wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Accessing images from the public/images folder */}
            <img src={`${process.env.PUBLIC_URL}/images/srlogo.png`} alt="StackRoute" className="stack-Style" />
            <button onClick={login} className="login-btn" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                {/* Accessing images from the public/images folder */}
                <img src={`${process.env.PUBLIC_URL}/images/gitlab.png`} alt="Bot Logo" className="bot-Style" />
                <span className="btn-text">Sign in with Gitlab</span>
            </button>
        </div>
    );
}

export default Login;

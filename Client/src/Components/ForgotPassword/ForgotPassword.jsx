import { useState } from 'react';
import TopNav from "../TopNav/TopNav.jsx";
import "../../Styles/ForgotPassword.css"

function ForgotPassword() {
    const [email, setEmail] = useState('');

    const getNewPassword = async (event) => {



    }

    return (
        <>
            {<TopNav />}
            <main>
                <h1>Welcome back</h1>
                <h2>Welcome back! please enter your details.</h2>
                <div className="">
                    <form className="" onSubmit={getNewPassword}>
                        <label className="" htmlFor="username">E-mail:</label>
                        <input
                            className=""
                            type="text"
                            id="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="submit-button" type="submit">reset password</button>
                    </form>
                </div>
            </main>
        </>
    );
}

export default ForgotPassword;

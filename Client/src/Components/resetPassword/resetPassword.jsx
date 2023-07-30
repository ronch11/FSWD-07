import { useState } from 'react';
import TopNav from "../TopNav/TopNav.jsx";
import "../../Styles/resetPassword.css"

function ResetPassword() {

    const resetPassword = async (event) => {

    }



    return (
        <>
            {<TopNav />}
            <main>
                <h1>Welcome back</h1>
                <h2>Enter your new password.</h2>
                        <label className="r-pass" htmlFor="Password">Password:</label>
                        <input className="repass"
                        />
                        <label className="r-pass" htmlFor="Password">Confirm Password:</label>
                        <input className="repass"

                        />
                        <button className="" type="submit">Confirm password</button>

            </main>
        </>
    );
}

export default ResetPassword;

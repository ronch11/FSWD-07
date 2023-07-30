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
                <div className="">
                    <form className="" onSubmit={resetPassword}>
                        <label className="" htmlFor="username">Password:</label>
                        <input


                        />
                        <label className="" htmlFor="username">Confirm Password:</label>
                        <input

                        />
                        <button className="" type="submit">Confirm password</button>
                    </form>
                </div>
            </main>
        </>
    );
}

export default ResetPassword;

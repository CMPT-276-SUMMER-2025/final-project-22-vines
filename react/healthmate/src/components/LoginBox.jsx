function LoginBox() {
    const users = [
        {email: "user@email.com", password: "password"}
    ]

    return (
        <div className='loginBox'>
        <p>Login Page</p>
        <form>
            <label>Email:</label>
            <input type="text" className="email"/>
            <br/>
            <label>Password:</label>
            <input type="text" className="password"/>
            <br/>
            <button type="submit">Login</button>
        </form>
        </div>
    )
}

export default LoginBox


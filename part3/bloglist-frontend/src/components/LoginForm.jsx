const LoginForm = ({ handleLogin, message, handlePasswordChange, handleUsernameChange, username, password }) => {
  return (
    <div>
      <h2>Login to phonebook</h2>
      <div>{message}</div>
      <form action="submit" onSubmit={handleLogin}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="text"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;

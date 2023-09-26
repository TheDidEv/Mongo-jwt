import React, { useContext, useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

function App() {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  });

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (!store.isAuth) {
    return (
      <LoginForm />
    )
  }
  return (
    <div className="App">
      <h1>{store.isAuth ? `User authorize: ${store.user.email}` : "user not authorize"}</h1>
      <h2>{store.user.isActivated ? "Account was verify" : "Account not verify"}</h2>
      <button onClick={() => store.logout()}>Exit</button>

      <button onClick={getUsers}>
        Get users
      </button>
      {users.map(user =>
        <div key={user.email}>{user.email}, {user.username}</div>
      )}


    </div>
  );
}

export default observer(App);

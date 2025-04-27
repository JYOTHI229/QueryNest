import { useState } from "react";
import axios from "../axios";

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/auth/register', form);
    alert('Registered successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} required />
      <input type="email" placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} required />
      <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

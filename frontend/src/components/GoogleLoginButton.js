import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export default function GoogleLoginButton({ setToken, setUser }) {
  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    const decoded = jwtDecode(idToken); // contains picture, name, email

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/google`, {
        token: idToken,
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);

      // Save user info
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture, // 👈 This is the image URL
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} />;
}

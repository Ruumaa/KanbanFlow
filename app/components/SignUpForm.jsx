'use client';
import { useRouter } from 'next/navigation';
import AuthForm from './AuthForm';
import { Bounce, toast } from 'react-toastify';
import { useState } from 'react';

const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const { username, password } = await values;
      const response = await fetch('/api/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const result = await response.json();
      console.log(result);

      if (result.data) {
        toast.success(result.message);
        // toast(`${result.message}`, {
        //   position: 'top-right',
        //   autoClose: 3000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: 'dark',
        //   transition: Bounce,
        // });
        router.push('/auth/sign-in');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error when register', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <AuthForm isRegister={true} submit={handleRegister} loading={loading} />
    </div>
  );
};

export default SignUpForm;

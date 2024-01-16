'use client';
import { signOut } from 'next-auth/react';
import { MdExitToApp } from 'react-icons/md';
const HandleLogout = () => {
  return (
    <button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/auth/sign-in`,
        })
      }
      className="btn btn-ghost text-red-600 hover:text-red-700"
    >
      <MdExitToApp size={28} />
    </button>
  );
};

export default HandleLogout;

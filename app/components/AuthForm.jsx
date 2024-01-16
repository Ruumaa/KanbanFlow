'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { BsKanban } from 'react-icons/bs';

const AuthForm = ({ isRegister, submit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div className="h-screen flex mx-auto items-center justify-center">
      <div className="w-1/3 h-auto bg-zinc-800 p-5 rounded-lg shadow-lg flex flex-col items-center">
        <div className="flex items-center w-full justify-center gap-2">
          <BsKanban size={70} className="text-indigo-700" />
          <h1 className="text-3xl font-bold font-roboto">
            <span className="text-indigo-700">Kanban</span> <br /> Flow
          </h1>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-indigo-700 mt-8">
            {isRegister ? 'Sign Up' : 'Sign In'}
          </h3>
          <p className="mt-3 text-slate-300">
            {isRegister
              ? 'Sign up and streamline your workflow '
              : 'Sign in and start managing your activities'}{' '}
          </p>

          <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-col w-full mt-8"
          >
            <label className="text-start mb-1 font-roboto">Username</label>
            <input
              autoComplete="off"
              type="text"
              {...register('username', { required: true })}
              className="input input-primary"
              placeholder="John"
            />
            {errors.username && (
              <span className="text-error text-start mt-1 text-xs">
                Username is required
              </span>
            )}
            <label className="text-start mb-1 mt-2 font-roboto">Password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="input input-primary"
              placeholder="*****"
            />
            {errors.password && (
              <span className="text-error text-start mt-1 text-xs">
                Password is required
              </span>
            )}
            <button
              type="submit"
              className={`btn  bg-stone-900 hover:ring-2 ring-indigo-700  hover:bg-stone-900 mt-6 ${
                loading ? 'ring-2' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                isRegister ? (
                  <div className="flex items-center gap-3">
                    <span className="loading loading-spinner loading-sm text-indigo-700"></span>
                    Singing up
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="loading loading-spinner loading-sm text-indigo-700"></span>
                    Signing In
                  </div>
                )
              ) : isRegister ? (
                'Sign Up'
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div className="  text-xs text-center mt-3 text-slate-400 ">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <Link
                  href="/auth/sign-in"
                  className="cursor-pointer underline text-indigo-600 hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/sign-up"
                  className=" cursor-pointer underline text-indigo-600 hover:text-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

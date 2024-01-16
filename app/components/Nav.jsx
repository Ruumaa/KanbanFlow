import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { BsKanban } from 'react-icons/bs';
import HandleLogout from './HandleLogout';

const Nav = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      {session && (
        <div className="navbar items-center px-9 bg-base-100">
          <Link
            href={'/'}
            className="flex mx-auto justify-center text-indigo-700 font-roboto cursor-pointer btn btn-ghost"
          >
            <BsKanban size={30} />
            <div className="flex flex-col text-start">
              <span className="">Kanban</span>
              <span className="text-white">Flow</span>
            </div>
          </Link>
          <div className="flex mr-3">
            <HandleLogout user={session.user} />
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;

import { getColumns } from '@/lib/fetch';
import KanbanBoard from './components/KanbanBoard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BASE_URL } from '@/lib/base_url';

export default async function Home() {
  const session = await getServerSession(authOptions);
  // const user = await fetch(`${BASE_URL}/api/auth`, {
  //   method: 'GET',
  //   cache: 'no-store',
  // });
  // const response = await user.json();
  // console.log(response.data[0].Column[0].Task);
  return (
    <>
      <KanbanBoard
        // columnsData={columnsData.data}
        user={session?.user}
      />
    </>
  );
}

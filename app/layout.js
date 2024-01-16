import { Poppins, Roboto } from 'next/font/google';
import './globals.css';
import ToastProvider from './ToastProvider';
import Nav from './components/Nav';

// const inter = Inter({ subsets: ['latin'] })

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: '400',
});
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: '400',
});

export const metadata = {
  title: 'Kanban Flow',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        <ToastProvider>
          <div className="flex flex-col h-screen max-h-screen">
            <Nav />
            <div className="flex-grow overflow-y-auto bg-page text-default-text">
              <main className="mx-7">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}

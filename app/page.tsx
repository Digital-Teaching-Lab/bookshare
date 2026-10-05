import {redirect} from 'next/navigation';
import {currentTeacher} from '@/lib/supabase/server';
import BookApp from './book-app';
export const dynamic='force-dynamic';
export default async function Home(){if(!await currentTeacher())redirect('/login');return <BookApp/>}

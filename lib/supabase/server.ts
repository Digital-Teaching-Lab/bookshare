import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';

export function configured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)}
export async function serverClient(){
 if(!configured())throw Error('Supabase 연결 설정이 필요해요.');
 const jar=await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{
  cookies:{getAll:()=>jar.getAll(),setAll(items){try{items.forEach(({name,value,options})=>jar.set(name,value,options))}catch{/* Server Components rely on proxy refresh. */}}}
 });
}
export async function currentTeacher(){
 if(!configured())return null;
 const db=await serverClient();const {data,error}=await db.auth.getUser();
 return error||!data.user?null:{db,user:data.user};
}

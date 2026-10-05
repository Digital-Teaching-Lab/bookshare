import {currentTeacher} from '@/lib/supabase/server';
export async function GET(request:Request){
 const teacher=await currentTeacher();if(!teacher)return new Response('로그인이 필요해요.',{status:401});
 const key=new URL(request.url).searchParams.get('key')||'';if(!key.startsWith(teacher.user.id+'/'))return new Response('접근할 수 없어요.',{status:403});
 const {data,error}=await teacher.db.storage.from('bookshare-media').createSignedUrl(key,60);
 if(error)return new Response('파일을 불러오지 못했어요.',{status:404});
 return new Response(null,{status:307,headers:{Location:data.signedUrl,'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
}

import {currentTeacher} from '@/lib/supabase/server';
type Item={title:string;author:string;publisher?:string;cover:string;link:string;adultYn?:string};
export async function GET(request:Request){
 if(!await currentTeacher())return Response.json({error:'로그인이 필요해요.'},{status:401});
 const q=(new URL(request.url).searchParams.get('q')||'').trim().slice(0,100);if(!q)return Response.json({items:[]});
 const key=process.env.YES24_API_KEY;if(!key)return Response.json({error:'예스24 연결 키를 설정해주세요.'},{status:503});
 try{const response=await fetch('https://apis.yes24.com/v1/goods/itemList?'+new URLSearchParams({query:q,category:'BOOK',pageSize:'10'}),{headers:{'X-Api-Key':key},signal:AbortSignal.timeout(10000),cache:'no-store'});const body=await response.json() as {success:boolean;data?:{items:Item[]}};if(!response.ok||!body.success)throw Error();return Response.json({items:(body.data?.items||[]).filter(i=>i.adultYn!=='Y').map(i=>({title:i.title,author:i.author,publisher:i.publisher||'',cover:i.cover,link:i.link,provider:'예스24'}))},{headers:{'Cache-Control':'private, no-store'}})}catch{return Response.json({error:'책 검색이 잠시 어려워요. 잠시 뒤 다시 찾아주세요.'},{status:502})}
}

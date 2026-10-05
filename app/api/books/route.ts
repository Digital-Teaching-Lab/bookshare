import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
type Item={title:string;author:string;publisher?:string;cover:string;link:string;adultYn?:string};
export async function GET(req:Request){
 if(!await getChatGPTUser())return Response.json({error:'로그인이 필요해요.'},{status:401});
 const q=(new URL(req.url).searchParams.get('q')||'').trim().slice(0,100);
 if(!q)return Response.json({items:[]});
 const key=(env as unknown as {YES24_API_KEY?:string}).YES24_API_KEY;
 if(!key)return Response.json({error:'예스24 검색 연결을 준비 중이에요. 지금은 책 제목을 직접 적어주세요.'},{status:503});
 try{
  const r=await fetch('https://apis.yes24.com/v1/goods/itemList?'+new URLSearchParams({query:q,category:'BOOK',pageSize:'10'}),{headers:{'X-Api-Key':key},signal:AbortSignal.timeout(10000)});
  const b=await r.json() as {success:boolean;data?:{items:Item[]}};
  if(!r.ok||!b.success)throw Error('book provider unavailable');
  const items=(b.data?.items||[]).filter(i=>i.adultYn!=='Y').map(i=>({title:i.title,author:i.author,publisher:i.publisher||'',cover:i.cover,link:i.link,provider:'예스24'}));
  return Response.json({items},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){console.error('book search',e);return Response.json({error:'책 검색이 잠시 어려워요. 제목을 직접 적거나 조금 뒤에 다시 찾아주세요.'},{status:502})}
}

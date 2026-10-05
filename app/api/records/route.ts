import {currentTeacher} from '@/lib/supabase/server';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){const teacher=await currentTeacher();if(!teacher)return json({error:'교사 로그인이 필요해요.'},401);const {data,error}=await teacher.db.from('recommendations').select('*').eq('owner',teacher.user.id).order('created',{ascending:false});return error?json({error:'책장을 불러오지 못했어요. Supabase 저장 공간 설정을 확인해주세요.'},503):json({records:data})}
async function save(request:Request){
 const teacher=await currentTeacher();if(!teacher)return json({error:'교사 로그인이 필요해요.'},401);
 try{
  const body=await request.json() as Record<string,unknown>;const str=(key:string,max:number)=>typeof body[key]==='string'?(body[key] as string).trim().slice(0,max):'';
  const id=str('id',50),name=str('name',50),title=str('title',200),reason=str('reason',3000),photo=str('photo',200),audio=str('audio',200),date=str('date',10),link=str('link',1500),cover=str('cover',1500);
  if(!id||!name||!title||(!reason&&!audio)||!/^[\w-]{1,50}$/.test(id))return json({error:'이름, 책 제목, 추천 이유를 확인해주세요.'},400);
  const timestamp=Date.parse(date+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date.startsWith('0000')||!Number.isFinite(timestamp)||new Date(timestamp).toISOString().slice(0,10)!==date)return json({error:'올바른 추천 날짜를 선택해주세요.'},400);
  for(const key of [photo,audio])if(key&&!key.startsWith(teacher.user.id+'/'))return json({error:'사진 또는 녹음의 소유자를 확인해주세요.'},400);
  if(link&&!/^https:\/\/(www\.)?yes24\.com\//.test(link))return json({error:'책 링크를 확인해주세요.'},400);
  if(cover&&!/^https:\/\//.test(cover))return json({error:'책 표지 주소를 확인해주세요.'},400);
  const values={name,title,reason,date,photo:photo||null,audio:audio||null,cover:cover||null,link:link||null,provider:link?'예스24':null,author:str('author',200),publisher:str('publisher',200)};
  if(request.method==='PUT'){
   const {data,error}=await teacher.db.from('recommendations').update(values).eq('id',id).eq('owner',teacher.user.id).select('id');
   if(error)return json({error:'수정하지 못했어요. 다시 시도해주세요.'},503);if(!data.length)return json({error:'수정할 기록이 없어요.'},404);
  }else{
   const {error}=await teacher.db.from('recommendations').insert({id,owner:teacher.user.id,...values});
   if(error){if(error.code==='23505'){const {data}=await teacher.db.from('recommendations').select('id').eq('id',id).eq('owner',teacher.user.id).maybeSingle();if(data)return json({ok:true})}return json({error:'저장하지 못했어요. 입력 내용은 그대로 있으니 다시 시도해주세요.'},503)}
  }
  return json({ok:true});
 }catch{return json({error:'입력 내용을 확인해주세요.'},400)}
}
export async function POST(request:Request){return save(request)}
export async function PUT(request:Request){return save(request)}
export async function DELETE(request:Request){const teacher=await currentTeacher();if(!teacher)return json({error:'교사 로그인이 필요해요.'},401);const id=new URL(request.url).searchParams.get('id');if(!id)return json({error:'삭제할 기록을 선택해주세요.'},400);const {data,error}=await teacher.db.from('recommendations').delete().eq('id',id).eq('owner',teacher.user.id).select('id');if(error)return json({error:'삭제하지 못했어요.'},503);if(!data.length)return json({error:'삭제할 기록이 없어요.'},404);return json({ok:true})}

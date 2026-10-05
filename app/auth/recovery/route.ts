import {NextResponse} from 'next/server';
import {serverClient} from '@/lib/supabase/server';
const valid=(token:string)=>/^[A-Za-z0-9_-]{20,256}$/.test(token);
function redirect(request:Request,path:string){return NextResponse.redirect(new URL(path,request.url),303)}
export async function GET(request:Request){
 const url=new URL(request.url);const token=url.searchParams.get('token_hash')||'';
 if(token&&valid(token))return new Response(`<!doctype html><html lang="ko"><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="referrer" content="no-referrer"><title>비밀번호 변경 확인</title><style>body{margin:0;background:#fff9ed;color:#294b48;font-family:Arial,'Malgun Gothic',sans-serif;line-height:1.8}main{max-width:500px;margin:8vh auto;padding:28px;background:#fffefb;border:2px solid #e9e3d2;border-radius:24px}button{width:100%;padding:18px;border:0;border-radius:16px;background:#397d6c;color:white;font-size:20px;cursor:pointer}</style></head><body><main><h1>비밀번호를 변경할까요?</h1><p>아래 버튼을 누르면 새 비밀번호를 정할 수 있어요.</p><form method="post" action="/auth/recovery"><input type="hidden" name="token_hash" value="${token}"><button type="submit">새 비밀번호 정하기</button></form></main></body></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"}});
 const code=url.searchParams.get('code');if(code){const db=await serverClient();const {error}=await db.auth.exchangeCodeForSession(code);if(!error)return redirect(request,'/reset-password')}
 return redirect(request,'/login?recovery=failed');
}
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return new Response('허용되지 않은 요청입니다.',{status:403});
 const token=(await request.formData()).get('token_hash');if(typeof token!=='string'||!valid(token))return redirect(request,'/login?recovery=failed');
 try{const db=await serverClient();const {error}=await db.auth.verifyOtp({token_hash:token,type:'recovery'});if(!error)return redirect(request,'/reset-password')}catch{}
 return redirect(request,'/login?recovery=failed');
}

'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {browserClient} from '@/lib/supabase/client';
import {authErrorMessage} from '@/lib/supabase/auth-errors';
export default function LoginForm(){
 const [mode,setMode]=useState<'login'|'signup'|'recover'>('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setMessage('');try{
  const db=browserClient();
  if(mode==='recover'){
   const {error}=await db.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+'/auth/recovery'});if(error)throw error;setMessage('가입된 이메일이라면 비밀번호 변경 링크를 보내드려요. 스팸함도 확인해주세요.');
  }else if(mode==='signup'){
   const {data,error}=await db.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:window.location.origin+'/auth/callback'}});
   if(error)throw error;if(data.session){window.location.assign('/');return}
   setMessage('이메일로 보낸 확인 링크를 눌러 가입을 완료해주세요.');
  }else{const {error}=await db.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;window.location.assign('/')}
 }catch(error){setMessage(authErrorMessage(error))}finally{setBusy(false)}}
 return <form onSubmit={submit}><div className="actions"><Button type="button" disabled={busy} className={mode==='login'?'active':''} onClick={()=>{setMode('login');setMessage('')}}>로그인</Button><Button type="button" disabled={busy} className={mode==='signup'?'active':''} onClick={()=>{setMode('signup');setMessage('')}}>선생님 가입</Button></div><label className="field">이메일<Input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254}/></label>{mode!=='recover'&&<label className="field">비밀번호<Input type="password" autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} minLength={8} maxLength={128} required/></label>}{mode==='signup'&&<p className="help">비밀번호는 8자 이상으로 정해주세요. 가입 후 이메일을 확인해주세요.</p>}{message&&<p className="notice" role="status">{message}</p>}<Button type="submit" className="primary wide" disabled={busy}>{busy?'확인 중…':mode==='recover'?'비밀번호 변경 메일 받기':mode==='login'?'우리 반 책장으로':'가입하기'}</Button><Button type="button" disabled={busy} className="recovery-link" onClick={()=>{setMode(mode==='recover'?'login':'recover');setPassword('');setMessage('')}}>{mode==='recover'?'로그인으로 돌아가기':'비밀번호 변경'}</Button></form>;
}


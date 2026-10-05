'use client';
import {useState} from 'react';
import {browserClient} from '@/lib/supabase/client';
import {authErrorMessage} from '@/lib/supabase/auth-errors';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
export default function ResetForm(){
 const [password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false);
 async function save(e:React.FormEvent){e.preventDefault();if(busy||saved)return;setMessage('');if(password!==confirm){setMessage('두 비밀번호가 달라요. 다시 확인해주세요.');return}if(password.length<8){setMessage('비밀번호를 8자 이상으로 정해주세요.');return}setBusy(true);try{const db=browserClient();const {error}=await db.auth.updateUser({password});if(error)throw error;setSaved(true);setPassword('');setConfirm('');setMessage('비밀번호를 변경했어요. 이제 새 비밀번호를 사용할 수 있어요.')}catch(error){setMessage(authErrorMessage(error))}finally{setBusy(false)}}
 return <form className="reset-password-form" onSubmit={save}>{!saved&&<><label className="field">새 비밀번호<Input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" minLength={8} maxLength={128} required disabled={busy}/></label><label className="field">새 비밀번호 확인<Input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" minLength={8} maxLength={128} required disabled={busy}/></label></>}{message&&<p className="notice" role="status">{message}</p>}{saved?<Button type="button" className="primary wide" onClick={()=>window.location.assign('/')}>우리 반 책장으로</Button>:<Button type="submit" className="primary wide" disabled={busy}>{busy?'변경 중…':'새 비밀번호 저장'}</Button>}</form>;
}


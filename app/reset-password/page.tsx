import {redirect} from 'next/navigation';
import {currentTeacher} from '@/lib/supabase/server';
import ResetForm from './reset-form';
export const dynamic='force-dynamic';
export default async function ResetPassword(){
 if(!await currentTeacher())redirect('/login?recovery=failed');
 return <><header><strong>우리 반 그림책장</strong></header><main className="login-main"><section><span className="badge">선생님 계정</span><h1>새 비밀번호를 정해주세요</h1><p>앞으로 로그인할 때 사용할 비밀번호예요.</p><ResetForm/></section></main></>;
}

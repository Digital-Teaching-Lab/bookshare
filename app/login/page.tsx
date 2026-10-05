import {redirect} from 'next/navigation';
import {configured,currentTeacher} from '@/lib/supabase/server';
import LoginForm from './login-form';
export const dynamic='force-dynamic';
export default async function Login(){
 if(await currentTeacher())redirect('/');
 return <><header><strong>우리 반 그림책장</strong></header><main className="login-main"><section><span className="badge">선생님 입장</span><h1>우리 반 책 이야기를 만나요</h1><p>선생님 계정마다 반 이름과 추천 기록이 따로 보관돼요.</p>{configured()?<LoginForm/>:<div className="notice"><h2>연결을 준비하고 있어요</h2><p>Supabase 프로젝트를 연결하면 선생님 로그인과 책장 저장을 사용할 수 있어요.</p></div>}</section></main></>;
}

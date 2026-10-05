export function authErrorMessage(error: unknown): string {
 const detail = error && typeof error === 'object' ? error as {code?: unknown; status?: unknown; name?: unknown} : {};
 const code = typeof detail.code === 'string' && /^[a-z0-9_]{1,64}$/.test(detail.code) ? detail.code : '';
 const messages: Record<string, string> = {
  email_address_not_authorized: '현재 메일 서비스는 관리자에게 허용된 이메일로만 보낼 수 있어요. 다른 선생님도 가입하려면 관리자가 이메일 발송 서비스(SMTP)를 연결해야 해요.',
  over_email_send_rate_limit: '이메일 발송 횟수 제한에 걸렸어요. 잠시 뒤 다시 시도해주세요. 관리자는 이메일 발송 서비스 설정을 확인해주세요.',
  over_request_rate_limit: '요청이 너무 많아요. 잠시 기다린 뒤 다시 시도해주세요.',
  email_address_invalid: '사용할 수 없는 이메일 주소예요. 주소를 다시 확인해주세요.',
  email_exists: '이미 가입된 이메일이에요. 로그인하거나 비밀번호 변경을 이용해주세요.',
  user_already_exists: '이미 가입된 계정이에요. 로그인하거나 비밀번호 변경을 이용해주세요.',
  email_not_confirmed: '가입 확인이 아직 끝나지 않았어요. 이메일의 가입 확인 링크를 눌러주세요.',
  invalid_credentials: '이메일이나 비밀번호가 맞지 않아요. 다시 확인해주세요.',
  weak_password: '비밀번호가 보안 조건에 맞지 않아요. 8자 이상으로, 영문·숫자·기호를 섞어 정해주세요.',
  same_password: '기존 비밀번호와 다른 새 비밀번호를 정해주세요.',
  signup_disabled: '현재 회원가입이 꺼져 있어요. 관리자에게 문의해주세요.',
  email_provider_disabled: '이메일 가입이나 로그인이 꺼져 있어요. 관리자에게 문의해주세요.',
  otp_expired: '메일 링크가 만료됐어요. 새 메일을 요청해주세요.',
  session_not_found: '로그인 상태를 확인할 수 없어요. 다시 로그인하거나 비밀번호 변경 메일을 요청해주세요.',
  reauthentication_needed: '다시 인증해야 비밀번호를 변경할 수 있어요. 다시 로그인한 뒤 시도해주세요.',
  request_timeout: '서버 응답이 늦어지고 있어요. 잠시 뒤 다시 시도해주세요.'
 };
 if (messages[code]) return `${messages[code]} (오류: ${code})`;
 if (detail.status === 429) return '요청 횟수 제한에 걸렸어요. 잠시 뒤 다시 시도해주세요. (오류: 429)';
 if (detail.name === 'AuthRetryableFetchError') return '서버에 연결하지 못했어요. 인터넷 연결을 확인하고 다시 시도해주세요.';
 const status = typeof detail.status === 'number' && Number.isInteger(detail.status) && detail.status >= 400 && detail.status <= 599 ? detail.status : undefined;
 return `요청을 완료하지 못했어요. 관리자에게 아래 오류 번호를 알려주세요. (오류: ${code || status || 'unknown'})`;
}

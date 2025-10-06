
# 밀토 미궁 (SPA, GitHub Pages 호환)

라우트 흐름:
```
/start -> /miltopia -> /WTvA -> /7000 -> /1019 -> /milytory -> /22(끝)
```

- 정답 입력 시 **바로 다음 문제 화면**으로 이동합니다.
- GitHub Pages에서 **index.html + 404.html**으로 딥링크를 처리합니다.
- 프로젝트/사용자 페이지 모두에서 동작하도록 BASE 경로를 자동 감지합니다.

## 배포
1) GitHub 레포 생성 후 이 폴더 업로드  
2) **Settings → Pages** → Deploy from a branch → `main` / `(root)` 저장  
3) 공개 URL 뒤에 `/start` 붙여 접속:  
   `https://{아이디}.github.io/{레포}/start`

## 수정
- `script.js`의 `LEVELS`에서 문구(`riddle`), 정답(`answer_b64`), 다음 경로(`next`) 수정
- base64 인코딩은 브라우저 콘솔에서:
```js
btoa(unescape(encodeURIComponent("정답문자열")));
```

> 참고: base64는 스포 방지용 최소 난독화일 뿐 보안은 아닙니다.

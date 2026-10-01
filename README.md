# 프로젝트 구조
```
dist/
src/pages
src/services
src/styles
src/app.js
index.html
```

js module 방식으로 연결할 예정으로 로컬에서 html을 열면 CORS 규칙 위반이 표시되니 vite 서버 설치나 VSCode의 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)를 설치하여 실행 권장

# CSS 빌드

TailwindCSS 사용
[참고](https://tailwindcss.com/docs/installation/tailwind-cli)

## Tailwind 설치

```
npm install tailwindcss @tailwindcss/cli
```

## Tailwind 빌드

배포 시
```
npx @tailwindcss/cli -i ./src/styles/app.css -o ./dist/styles/app.css
```

개발 시 (watch 옵션으로 app.css 변경 시 자동 빌드)
```
npx @tailwindcss/cli -i ./src/styles/app.css -o ./dist/styles/app.css --watch
```

# Unit Test
jest 설정 보다는 단순 기능 동작을 테스트하기 위한 것이며 추후 jest 설정 및 DI 적용 필요

tests/

네이밍 규칙 `단위.test.js`

# webRTC-starter

웹페이지로 접속하는 모든 유저는 접속 즉시 웹소켓 연결을 시도합니다.  
웹소켓으로 연결된 유저는 SocketID를 통해서 연결할 대상을 식별하고 webRTC 연결을 시도합니다.

## Scripts
- **```yarn dev:client```**: client webpack을 watch옵션으로 구동됩니다. 변경사항은 바로 바로 반영되며 `dist/client/index.js` 파일로 빌드됩니다.
- **```yarn dev:server```**: ts-node 로 src/server/index.ts 를 실행합니다. 변경사항이 있으면 바로 서버로 재시작되고 변경사항이 반영됩니다.
- **```yarn dev```**: 위의 두 scripts(```yarn dev:client```, ```yarn dev:server```)를 동시에 실행합니다.

## Docker
### build
docker image를 빌드하기 이전에 `yarn build` 명령어를 통해서 webpack build가 선행되어야 함.
```
docker build . -t <NAME AND TAG>
```

### push
```
docker push <NAME AND TAG>
```

### docker image 실행
```
docker run -p 8080:8080 -d <NAME AND TAG>
```

### 실행 중인 docker image의 bash로 접속
```
docker run -p 8080:8080 -d <NAME AND TAG>
```

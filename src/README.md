

docker compose -f hbm-app.infra.yml -p hbm-app up -d

docker compose -f hbm-app.core.yml -p hbm-app up -d --force-recreate
docker compose -f hbm-app.core.yml build 

docker compose -f hbm-app.emulators.yml -p hbm-app up -d

docker compose -f hbm-app.core.yml build hbm-dotnet-app
docker compose -f hbm-app.core.yml build hbm-node-app

docker run --rm -p 9088:80 nginxdemos/hello



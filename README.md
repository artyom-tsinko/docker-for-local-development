# docker-for-local-development


# Diag

docker run -it --rm --network=hbm_local_net nicolaka/netshoot



curl -X POST -H "Content-Type: application/json" -d '{ "host" : "hbm-node-app", "port":"3000" }' http://hbm-java-app:8080/connect

curl -X POST -H "Content-Type: application/json" -d '{ "host" : "hbm-java-app", "port":"8080" }' http://hbm-dotnet-app:8080/connect

docker run -it --rm --network=hbm_local_net -v ./diag.sh:/diag.sh:ro nicolaka/netshoot sleep infinity

docker run -it --rm --network=hbm_local_net -v ${pwd}/diag.sh:/diag.sh:ro nicolaka/netshoot /bin/bash /diag.sh
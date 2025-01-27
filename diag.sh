#!/bin/bash

# Define an array of hosts
hosts=("hbm-node-app:3000" "hbm-dotnet-app:8080" "hbm-java-app:8080" "hbm-python-app:8080")

# ANSI color codes
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Starting diagnostics..."
echo -e "\n"

echo "Checking health..."
echo -e "\n"

for tuple in "${hosts[@]}"
do
  IFS=':' read -r host port <<< "$tuple"
  echo "Health for $host:$port"
  curl -sS -X GET http://$host:$port/health | jq .
  echo -e "\n"
done

echo "Checking env..."
echo -e "\n"

for tuple in "${hosts[@]}"
do
  IFS=':' read -r host port <<< "$tuple"
  echo "Env for $host:$port"
  curl -sS -X GET http://$host:$port/env | jq .
  echo -e "\n"
done


echo "Checking connectivity..."
echo -e "\n"

for tuple in "${hosts[@]}"
do
  IFS=':' read -r host port <<< "$tuple"
  
  echo "Connectivity from $host:$port"

  for inner_tuple in "${hosts[@]}"
  do
    IFS=':' read -r inner_host inner_port <<< "$inner_tuple"

    if [ "$inner_host" = "$host" ]; then
      echo "Skipping host $inner_host"
    else
      echo "Checking $inner_host from $host"

      json="{ \"host\" : \"$inner_host\", \"port\":\"$inner_port\" }" 
      url="http://$host:$port/connect"

      response=$(curl -sS -w "%{http_code}" -X POST -o /tmp/curl_output -H "Content-Type: application/json" -d "$json" $url)
      if [ "$response" -eq 200 ]; then
        cat /tmp/curl_output | jq .
      else
        echo -e "${RED}Connectivity check failed for $host:$port with status code $response${NC}"
      fi
    
    fi

  done

  echo -e "\n"


done




echo "Diagnostics complete."

Topics to cover

1. Project local dev env setup (with docker compose, for individual developers) - Refer to the purity and frequency of experiments topic (scientific method)

  - init state with bash scripts (ask about terraform?)  

  - full solution setup

    - ready-made alternatives from vendors?

  - debug experience (replace running containers, debug from VS and/or VS Code)

  - debug directly docker vs debug in vs studio

    https://www.docker.com/blog/streamlining-local-development-with-dev-containers-and-testcontainers-cloud/

  - 3rd party / cloud services emulation

    - azurite
    - localstack
    - wiremock

--------------------------------------


2. Tools and utilities (cross platform) - Refer to pragmatic programmer (automate / optimize everything topic)

  - networking

    - troubleshoot
    - diagnostics
    - proxy (e.g. shrink traffic channel)

  - performance measurement (ab)

  - processing tools (jq | curl | wget | bash | etc)

    - database utils (for complex migrations)

    - local CI/CD (if necessary)

    - data generation / injestion

3. Prototyping / studying / R&D - Referrer to "you control only what you can destroy" saying

  - diff. cluster setups behavior investigation

  - cdc setup assurance

  - ready-made setups (on awesome-compose and other resources)


-----------------------


Visual Studio conatiner tools

 - https://learn.microsoft.com/en-us/visualstudio/containers/overview?view=vs-2022

Devcontainers

 - https://code.visualstudio.com/docs/devcontainers/tutorial

 - Extension for VS Code: https://code.visualstudio.com/docs/devcontainers/tutorial#_install-the-extension
 
 - Spec: https://containers.dev/implementors/spec/

 - VS code impl. details: 
   https://code.visualstudio.com/docs/remote/vscode-server
   https://code.visualstudio.com/docs/devcontainers/containers
   
 - Github images
   https://github.com/devcontainers
   https://github.com/devcontainers/images


!!! Check debug in docker from VS Code !!!
It is possible to set it up with Docker, but setup is not trivial (various volume mappings and other workarounds are involved)


Create multi-lang solution, with diff. repositories, aka:

1. Repo for infra / docker compose / utils
  
 - infra : RDBM  : postgres
 - infra : NoSQL : mongo
 - infra : AMQP  : Rabbit

 - infra : Azure : Azurite
 - infra : AWS   : localstack

2. Repo for Node.js app

3. Repo for Python app

4. Repo for .NET app

5. Repo for Java app


Sidenotes:


Demonstrate access to emulators via management UI (Azure and AWS)

Explain where to get images for various setups Redis, RDBM, NoSQL, etc (duockerhub, awesome-compose, etc)


# Test apps endpoints:

1. GET /health - check connections to infra, health report

    - implement shared configs

2. POST /connect - connect anoother endpoint within the network

3. GET /env - print environment variables




# Presentation script

1. 

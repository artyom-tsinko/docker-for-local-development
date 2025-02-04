
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

-1. Add README on each level explaining how to perform basic installation of the app and VS code with devcontainers.


0. Explain personal development process - local experiments, scientific method (speed of experiment, purity of experiment).
   How it was:
     - local software
     - shared on remote server
     - shared in cloud
     - virtualized / isolated!

0.1 Docker use cases

  - local development

  - tools and utilities

1. Present the HBM sample project "architecture"

   - explain infra
   - explain apps

2. Show local infra, virtualized in docker (infra.yaml)

   - admin / control UI alongside with actual infra

   - demo data mounts vs volumes

   - init data with tools and utilities section

3. Present cloud emulators (hbm-app.emulators.yml)

4. Present apps part (hbm-app.core.yml), highlight ability to:

   - build docker images locally from source code + compose project

   - run full platform locally from sources built (without running each service in IDE)

4.1 DEBUG apps running in docker container

   - debug process is complex (jacky chan) even on local machine (refer to OS-level calls, kernel / user space, etc)

   - debug in docker is always a form of remote debug (due to container isolation) - simpler (eddie murphy)

   - debug is specific to IDE / technology / OS you're on

   - meet devcontainers as *one of possibilities*
     - refer gh codespaces

   - demo debugged containers running in parallel with "generic" ones

     - explain the idea of replacing container with the same domain name, same ports exposed and shared (mounted) config

5. Conclusions - show PAI as full-fledged app

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ./Hbm.DotNet.App Hbm.DotNet.App

RUN dotnet restore "Hbm.DotNet.App/Hbm.DotNet.App.csproj"
COPY . .
WORKDIR "/src/Hbm.DotNet.App"
RUN dotnet build "Hbm.DotNet.App.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Hbm.DotNet.App.csproj" -c Release -o /app/publish

FROM base AS final
EXPOSE 8080
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Hbm.DotNet.App.dll"]

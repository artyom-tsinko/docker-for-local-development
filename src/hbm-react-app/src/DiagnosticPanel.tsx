import { Button, Checkbox, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, SelectChangeEvent } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { IHbmApp } from './store';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { hbmApps, KnownHbmApps } from './store';

type KnownRequests = 'env' | 'health' | 'connect';

export default function DiagnosticPanel(props: { appData: IHbmApp }) {

  const [selectedApp, setSelectedApp] = useState<KnownHbmApps | ''>('');
  const [useDevPort, setUseDevPort] = useState(false);
  const baseUrl = `http://localhost:${useDevPort ? props.appData.devPort : props.appData.localPort}`;

  const [currentRequest, setCurrentRequest] = useState<KnownRequests | undefined>(undefined);

  const { data: envData, error: getEnvError, isLoading: isEnvLoading, refetch: refetchGetEnv } = useQuery({
    queryKey: ['env', baseUrl],
    queryFn: async () => (await axios.get(`${baseUrl}/env`)).data,
    enabled: false,
  });

  const { data: healthData, error: getHealthError, isLoading: isHealthLoading, refetch: refetchGetHealth } = useQuery({
    queryKey: ['env', baseUrl],
    queryFn: async () => (await axios.get(`${baseUrl}/health`)).data,
    enabled: false,
  });

  const { data: connectData, error: getConnectError, isLoading: isConnectLoading, refetch: refetchPostConnect } = useQuery({
    queryKey: ['connect', baseUrl],
    queryFn: async () => {

      if (selectedApp === '') {throw new Error('No app selected');}
      const targetApp = hbmApps[selectedApp];

      const response = await axios.post(`${baseUrl}/connect`, {
        host: targetApp.host,
        port: targetApp.port,
      });
      return response.data;
    },
    enabled: false,
  });

  const [currentOutputData, setCurrentOutputData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryError, setQueryError] = useState<Error|null>(null);

  useEffect(() => {
    switch (currentRequest) {
      case 'env':
        setCurrentOutputData(envData);
        break;
      case 'health':
        setCurrentOutputData(healthData);
        break;
      case 'connect':
        setCurrentOutputData(connectData);
        break;
    }
  }, [currentRequest, envData, healthData, connectData]);
  
  useEffect(()=> {
    switch (currentRequest) {
      case 'env':
        setQueryError(getEnvError);
        break;
      case 'health':
        setQueryError(getHealthError);
        break;
      case 'connect':
        setQueryError(getConnectError);
        break;
    }
  }, [currentRequest, getEnvError, getHealthError, getConnectError]);

  useEffect(() => {
    switch (currentRequest) {
      case 'env':
        setIsLoading(isEnvLoading);
        break;
      case 'health':
        setIsLoading(isHealthLoading);
        break;
      case 'connect':
        setIsLoading(isConnectLoading);
        break;
    }
  }, [currentRequest, isEnvLoading, isHealthLoading, isConnectLoading]);
  
  const handleUseDevPortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseDevPort(event.target.checked);
  };

  const handleAppChange = (event: SelectChangeEvent<KnownHbmApps>) => {
    setSelectedApp(event.target.value as KnownHbmApps);
  };
  
  return (

    <Container maxWidth={false} style={{height: '100%', padding: '1rem', overflow: 'hidden' }}>

      <Typography sx={{ color: 'text.secondary' }}>
        {`${props.appData.name} Diagnostic Panel`}
      </Typography>

      <FormControlLabel
        control={<Checkbox checked={useDevPort} onChange={handleUseDevPortChange} />}
        label="Use Dev Port"
      />

      <Button variant="contained" onClick={() =>{ refetchGetEnv(); setCurrentRequest('env'); }} sx={{ margin:'.5rem' }}>Get Env</Button>
      <Button variant="contained" onClick={() => { refetchGetHealth(); setCurrentRequest('health'); }} sx={{ margin:'.5rem' }}>Get Health</Button>
      <Button variant="contained" disabled={!selectedApp} onClick={() => { refetchPostConnect(); setCurrentRequest('connect'); }} sx={{ margin:'.5rem' }}>Connect To:</Button>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="app-select-label">Select App</InputLabel>
        <Select
          labelId="app-select-label"
          value={selectedApp}
          onChange={handleAppChange}
          label="Select App"
          sx={{ padding: 0, margin: 0 }}
        >
          {Object.values(KnownHbmApps)
            .filter(appkey => hbmApps[appkey as KnownHbmApps].name !== props.appData.name)
            .map(appkey => (
              <MenuItem key={appkey} value={appkey}>{hbmApps[appkey as KnownHbmApps].name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper sx={{ height: '70%', width: '100%', overflow: 'auto', backgroundColor: 'black', marginTop: '.5rem' }}>
        <Typography sx={{ color: 'white', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {currentOutputData ? JSON.stringify(currentOutputData, null, 2) : 'No data'}
          {isLoading  && <Typography>Loading...</Typography>}
          {queryError && <Typography>Error: {queryError.message}</Typography>}
        </Typography>
      </Paper>

    </Container>
    
  );
}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container, Grid2 } from '@mui/material';
import DiagnosticPanel from './DiagnosticPanel';
import { hbmApps, KnownHbmApps } from './store';

const queryClient = new QueryClient();

function FullScreenGrid() {
  return (
    <Grid2 container sx={{ height: '100%', width: '100%', margin: 0, padding: 0 }}>
      <Grid2 size={6} sx={{ border: '1px solid #ccc', height: '50%' }}>
        <DiagnosticPanel appData={hbmApps[KnownHbmApps.NodeApp]} />
      </Grid2>
      <Grid2 size={6} sx={{ border: '1px solid #ccc', height: '50%' }}>
        <DiagnosticPanel appData={hbmApps[KnownHbmApps.DotNetApp]} />
      </Grid2>
      <Grid2 size={6} sx={{ border: '1px solid #ccc', height: '50%' }}>
        <DiagnosticPanel appData={hbmApps[KnownHbmApps.PythonApp]} />
      </Grid2>
      <Grid2 size={6} sx={{ border: '1px solid #ccc', height: '50%' }}>
        <DiagnosticPanel appData={hbmApps[KnownHbmApps.JavaApp]} />
      </Grid2>
    </Grid2>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container maxWidth={false} sx={{ height: '100vh', width: '100vw', overflow: 'hidden', margin: 0, padding: 0 }}> 
        <FullScreenGrid />
      </Container>  
    </QueryClientProvider>
  );
}

import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { blueGrey, orange } from '@mui/material/colors';
import Section from './components/Section';
import { useState } from 'react';
import Slider from './components/Slider'

export default function App() {
  const [years, setYears] = useState<number>(10);
  const [degrees, setDegrees] = useState<number>(0);
  const [price, setPrice] = useState<number | undefined>(undefined);

  const handleYearsChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setYears(newValue);
    }
  };

  const handleDegreesChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setDegrees(newValue);
    }
  };

  const handleClick = (): void => {
    setPrice(degrees * years);
    const apiUrl: string = `https://example.com/api?years=${years}&degrees=${degrees}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('API call successful');
      })
      .catch(error => {
        console.error('There was a problem with the API call:', error);
      });
  };

  return (
    <>
      <AppBar 
        elevation={0}
        sx={{
          backgroundColor: blueGrey[800]
        }}
      >
        <Toolbar>
          <Typography variant="h6">Price of Climate Change</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: 350,
          flex: "none",
          color: 'white',
          backgroundColor: blueGrey[300]
        }}
      >
        <Typography variant="h3">Banner</Typography>
      </Box>
      <Box 
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          backgroundColor: blueGrey[100]
        }}
      >
        <Section bgColor={orange[200]}>
          <div>
            <Slider 
              min={10}
              max={100}
              title='Years'
              step={5}
              value={years}
              onChange={handleYearsChange}
            />
          </div>
        </Section>
        <Section bgColor={orange[200]}>
          <div>
            <Slider
              min={0}
              max={10}
              title='Degrees'
              step={0.1}
              value={degrees}
              onChange={handleDegreesChange}
            />
          </div>
        </Section>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          flex: "none",
          color: 'white',
          backgroundColor: blueGrey[900]
        }}
      >
        <Button variant="contained" onClick={handleClick}>Submit</Button>
      </Box>
      {price ? <p>{price}</p> : <p>No data</p>}
    </>
  );
}
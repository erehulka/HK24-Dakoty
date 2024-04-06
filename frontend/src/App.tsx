import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { blueGrey, orange } from '@mui/material/colors';
import Section from './components/Section';
import { useState } from 'react';
import Slider from './components/Slider'
import CustomCard from './components/Card';
import axios, { AxiosResponse } from 'axios';

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
    const apiUrl: string = `http://127.0.0.1:5000/data`

    axios.post(apiUrl, {years, degrees})
      .then((res: AxiosResponse<{result: number}>) => {
        setPrice(res.data.result)
      })
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
          backgroundColor: blueGrey[700],
        }}
      >
        <Section bgColor={blueGrey[700]}>
          <Typography variant="h5">Specify by how much you want the world's temperature to decrease and in how many years. After pressing submit, you will see the cost of such a change in the future.</Typography>
        </Section>
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
              title='Degrees celsius'
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
          backgroundColor: orange[200],
          paddingBottom: '8px',
        }}
      >
        <Button variant="contained" onClick={handleClick}>Submit</Button>
      </Box>
      {price 
        ? <Section bgColor='white'>
          {price}
          <CustomCard
            image='/usa.webp'
            text='ameriť'
            color='blue'
            description='Kolko HDP'
          ></CustomCard>
          <CustomCard
            image='/usa.webp'
            text='ameriťka'
            color='blue'
            description='Kolko HDP'
          ></CustomCard>
          <CustomCard
            image='/usa.webp'
            text='americ'
            color='blue'
            description='Kolko HDP'
          ></CustomCard>
          <CustomCard
            image='/usa.webp'
            text='ameriťulka'
            color='blue'
            description='Kolko HDP'
          ></CustomCard>
          <CustomCard
            image='/usa.webp'
            text='ameritisko'
            color='blue'
            description='Kolko HDP'
          ></CustomCard>
        </Section> 
        : ''
      }
    </>
  );
}
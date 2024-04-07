import { AppBar, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Toolbar, Typography } from '@mui/material';
import Section from './components/Section';
import { useState } from 'react';
import Slider from './components/Slider'
import CustomCard from './components/Card';
import axios, { AxiosResponse } from 'axios';

const GDP_EU_ANNUAL = 19_350_000_000_000
const SLOVAKIA_ANNUAL_SALARY = 18528
const SKODA_FABIA_PRICE = 16_550
const IPHONE_15_PRO_MAX = 1270

export default function App() {
  const [years, setYears] = useState<number>(10);
  const [degrees, setDegrees] = useState<number>(0.2);
  const [scenario, setScenario] = useState<string | undefined>("SSP1-1.9");
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

  const handleScenarioChange = (event: SelectChangeEvent<string>) => {
    setScenario(event.target.value as string);
  };

  const formatPrice = (price: number, constant: number): string => {
    const result = price / constant
    if (result > 10) {
      return Math.round(result).toString()
    }
    return (price / constant).toFixed(2)
  }

  const handleClick = (): void => {
    if (!years || !degrees || !scenario) {
      return
    }
    const apiUrl: string = `http://127.0.0.1:5000/data`

    axios.post(apiUrl, {years, degrees, scenario})
      .then((res: AxiosResponse<{result: number}>) => {
        setPrice(res.data.result)
      })
  };

  return (
    <div>
      <AppBar 
        elevation={0}
        sx={{
          backgroundColor: 'black'
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
          //backgroundColor: blueGrey[700],
          background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      >
        <Section bgColor='transparent'>
          <Typography variant="h4" sx={{
            fontWeight: 'bold'
          }}>Specify by how much you want the world's temperature to decrease and in how many years. After pressing submit, you will see the cost of such a change in the future.</Typography>
        </Section>
      </Box>
      <Box 
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          backgroundColor: 'white'
        }}
      >
        <Section bgColor='white'>
          <div>
            <Slider 
              min={5}
              max={100}
              title='Years'
              step={5}
              value={years}
              onChange={handleYearsChange}
            />
          </div>
        </Section>
        <Section bgColor='white'>
          <div>
            <Slider
              min={0.1}
              max={Math.round(years / 36 * 10) / 10}
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
          backgroundColor: 'white',
          paddingBottom: '8px',
        }}
      >
        <FormControl
          sx={{
            width: '130px'
          }}
        >
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={scenario}
            label="Model"
            onChange={handleScenarioChange}
          >
            <MenuItem value="SSP1-1.9" selected>SSP1-1.9</MenuItem>
            <MenuItem value="SSP1-2.6">SSP1-2.6</MenuItem>
            <MenuItem value="SSP3-7.0">SSP3-7.0</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          flex: "none",
          color: 'white',
          backgroundColor: 'white',
          paddingBottom: '8px',
        }}
      >
        <Button variant="contained" onClick={handleClick}>Submit</Button>
      </Box>
      {price 
        ? <Section bgColor='white'>
          <Typography variant='h4' textAlign='center' fontWeight='bold'>{price.toFixed(2)}€</Typography>
          <Typography variant='h5' textAlign='center'>Must be spent to reach this goal!</Typography>
          <CustomCard
            image='/eu.jpg'
            text='Annual GDP in EU'
            color='blue'
            description={<>
              <strong style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{formatPrice(price, GDP_EU_ANNUAL)}</strong> <strong>annual GDP</strong> in whole EU are needed to be paid.</>}
          ></CustomCard>
          <CustomCard
            image='/svk_money.png'
            text='Annual salaries in Slovakia'
            color='blue'
            description={<>
              <strong style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{formatPrice(price, SLOVAKIA_ANNUAL_SALARY)}</strong> <strong>annual salaries</strong> in Slovakia are needed to be paid.</>}
          ></CustomCard>
          <CustomCard
            image='/iphone.jpg'
            text='iPhones'
            color='blue'
            description={<>
              The price is equal to <strong style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{formatPrice(price, IPHONE_15_PRO_MAX)}</strong> <strong>iPhone 15 Pro Max</strong> phones.</>}
          ></CustomCard>
          <CustomCard
            image='/fabia.jpg'
            text='Škoda Fabias'
            color='blue'
            description={<>
              The price is equal to <strong style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{formatPrice(price, SKODA_FABIA_PRICE)}</strong> <strong>Skoda Fabias.</strong></>}
          ></CustomCard>
        </Section> 
        : ''
      }
    </div>
  );
}
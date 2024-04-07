import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { blueGrey, orange } from '@mui/material/colors';
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

  const formatPrice = (price: number, constant: number): string => {
    return (price / constant).toFixed(2)
  }

  const handleClick = (): void => {
    setPrice(degrees * years);
    const apiUrl: string = `http://127.0.0.1:5000/data`

    axios.post(apiUrl, {years, degrees})
      .then((res: AxiosResponse<{result: number}>) => {
        setPrice(res.data.result)
      })
  };

  return (
    <div>
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
          backgroundColor: blueGrey[100]
        }}
      >
        <Section bgColor={orange[200]}>
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
        <Section bgColor={orange[200]}>
          <div>
            <Slider
              min={0.1}
              max={3}
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
          <Typography variant='h4' textAlign='center'>{price.toFixed(2)}€</Typography>
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
            text='Iphones'
            color='blue'
            description={<>
              The price is equal to <strong style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{formatPrice(price, IPHONE_15_PRO_MAX)}</strong> <strong>Iphone 15 Pro Max</strong> phones.</>}
          ></CustomCard>
          <CustomCard
            image='/fabia.jpg'
            text='Skoda Fabias'
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
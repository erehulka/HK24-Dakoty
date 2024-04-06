import { Button } from '@mui/material';
import Slider from './components/Slider';

function App(): JSX.Element {

  const handleClick = (): void => {
    // Replace 'your-api-url' with your actual API endpoint
    const apiUrl: string = `https://example.com/api?slider1=TODO&slider2=TODO`;

    // Make the API call
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // You can handle successful response here
        console.log('API call successful');
      })
      .catch(error => {
        // Handle errors here
        console.error('There was a problem with the API call:', error);
      });
  };

  return (
    <div>
      <div>
        <Slider
          min={10}
          max={100}
          title='Years'
          step={1}
        />
      </div>
      <div>
        <Slider 
          min={0}
          max={10}
          title='Degrees'
          step={0.1}
        />
      </div>
      <Button variant="contained" onClick={handleClick}>Submit</Button>
    </div>
  );
}

export default App;

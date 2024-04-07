import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'

interface CardProps {
  image: string
  text: string
  color: string
  description: any
}

export default function CustomCard({ image, text, color, description }: CardProps): JSX.Element {
  return (
    <div>
      <Card sx={{ display: 'flex', marginBottom: '1em', borderColor: color }}>
        <CardMedia
          component="img"
          sx={{ width: 151, height: 100 }}
          image={image}
          alt={text}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto', padding: '8px' }}>
            <Typography component="div" variant="h5">
              { text }
            </Typography>
          </CardContent>
          <Box sx={{ display: 'inline', pl: 1, pb: 1 }}>
            { description }
          </Box>
        </Box>
      </Card>
    </div>
  );
}
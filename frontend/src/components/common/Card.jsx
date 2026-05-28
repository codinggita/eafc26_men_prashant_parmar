import { Card as MuiCard, CardContent, Typography } from '@mui/material';

const Card = ({ title, children, ...props }) => {
  return (
    <MuiCard {...props}>
      <CardContent>
        {title && (
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;

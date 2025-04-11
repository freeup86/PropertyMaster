// src/components/dashboard/PropertySummaryCard.tsx
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { 
  Home as HomeIcon, 
  ViewModule as UnitIcon, 
  AttachMoney as MoneyIcon, 
  TrendingUp as CashFlowIcon 
} from '@mui/icons-material';

interface PropertySummaryCardProps {
  title: string;
  value: number;
  icon: 'property' | 'unit' | 'money' | 'cashflow';
  isCurrency?: boolean;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'error';
}

const PropertySummaryCard: React.FC<PropertySummaryCardProps> = ({ 
  title, 
  value, 
  icon, 
  isCurrency = false,
  color = 'default'
}) => {
  // Format value
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value.toLocaleString();
  
  // Get icon component
  const getIcon = () => {
    switch (icon) {
      case 'property':
        return <HomeIcon fontSize="large" />;
      case 'unit':
        return <UnitIcon fontSize="large" />;
      case 'money':
        return <MoneyIcon fontSize="large" />;
      case 'cashflow':
        return <CashFlowIcon fontSize="large" />;
      default:
        return <HomeIcon fontSize="large" />;
    }
  };
  
  // Get color style
  const getColorStyle = () => {
    switch (color) {
      case 'primary':
        return { color: 'primary.main' };
      case 'secondary':
        return { color: 'secondary.main' };
      case 'success':
        return { color: 'success.main' };
      case 'error':
        return { color: 'error.main' };
      default:
        return { color: 'text.primary' };
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',
        height: 140 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Box sx={{ color: 'primary.main' }}>
          {getIcon()}
        </Box>
      </Box>
      <Typography 
        variant="h4"
        component="div"
        sx={{ ...getColorStyle(), fontWeight: 'bold', mt: 'auto' }}
      >
        {formattedValue}
      </Typography>
    </Paper>
  );
};

export default PropertySummaryCard;
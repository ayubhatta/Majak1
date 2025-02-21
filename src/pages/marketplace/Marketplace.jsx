import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Slider,
  Toolbar,
  Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { addToCartApi, getAllBikePartsApi, userID } from '../../api/api'; // Import addToCartApi

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllBikePartsApi();
        setProducts(response.data.bikeParts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const data = {
        userId: userID, // Include user ID
        productId: product.id,
        quantity: 1,
      };

      await addToCartApi(data); // Call API function
      setCartCount((prev) => prev + 1); // Update UI cart count
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position='static'
        color='default'
        elevation={1}>
        <Toolbar>
          <Typography
            variant='h6'
            sx={{ flexGrow: 1 }}>
            Bike Parts Marketplace
          </Typography>
          <IconButton color='inherit'>
            <Badge
              badgeContent={cartCount}
              color='primary'>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth='lg'
        sx={{ mt: 3, mb: 2 }}>
        <OutlinedInput
          fullWidth
          placeholder='Search products...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startAdornment={
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          }
        />
      </Container>

      <Container maxWidth='lg'>
        <Grid
          container
          spacing={3}>
          <Grid
            item
            xs={12}
            md={3}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterListIcon sx={{ mr: 1 }} />
                <Typography variant='h6'>Filters</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <FormControl
                fullWidth
                sx={{ mb: 3 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  <MenuItem value=''>All Categories</MenuItem>
                  <MenuItem value='brakes'>Brakes</MenuItem>
                  <MenuItem value='gears'>Gears</MenuItem>
                  <MenuItem value='wheels'>Wheels</MenuItem>
                  <MenuItem value='pedals'>Pedals</MenuItem>
                </Select>
              </FormControl>
              <Typography variant='subtitle2'>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay='auto'
                min={0}
                max={2000}
              />
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}>
            <FormControl
              sx={{ minWidth: 200 }}
              size='small'>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty>
                <MenuItem value=''>Sort by</MenuItem>
                <MenuItem value='price_asc'>Price: Low to High</MenuItem>
                <MenuItem value='price_desc'>Price: High to Low</MenuItem>
                <MenuItem value='rating'>Rating</MenuItem>
              </Select>
            </FormControl>
            <Grid
              container
              spacing={3}>
              {products.map((product) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={product.id}>
                  <Card>
                    <CardMedia
                      component='img'
                      height='200'
                      image={product.partImage}
                      alt={product.partName}
                    />
                    <CardContent>
                      <Typography variant='h6'>{product.partName}</Typography>
                      <Typography>${product.price.toFixed(2)}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant='contained'
                        onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Marketplace;

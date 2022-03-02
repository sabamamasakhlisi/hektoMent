import React from "react";
import { useSelector } from "react-redux";
import classes from "./TrendingProducts.module.scss";
import * as images from "../../assets/img";

import Grid from "@mui/material/Grid";
import SingleProduct from "./SingleProduct";
import Banner from "./Banner";

const TrendingProducts = () => {
  const productsList = useSelector((state) => state.productsReducer.products);
  const currency = useSelector((state) => state.productsReducer.currency);

  const trendingItems = [...productsList].slice(0, 4).map((product) => (
    <Grid
      item
      xs={12}
      md={6}
      lg={3}
      justifyContent="center"
      alignContent="center"
    >
      <SingleProduct product={product} currency={currency} />
    </Grid>
  ));

  const smallList = [...productsList].slice(4, 7).map((product) => {
    return (
      <SingleProduct product={product} currency={currency} type="horizontal" />
    );
  });

  return (
    <Grid container spacing={5} marginTop={6} marginBottom={10}>
      <Grid item xs={12}>
        <h2 className={classes.heading}>Trending Products</h2>
      </Grid>
      {trendingItems}
      <Grid item xs={12} md={6} lg={4}>
        <Banner
          text="23% off for selected items"
          buttonText="Shop now"
          image={images.clock}
          type="1"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Banner
          text="10% off in all products"
          buttonText="See Collection"
          image={images.tvStand}
          type="2"
        />
      </Grid>
      <Grid item xs={12} md={12} lg={4}>
        <div className={classes["small-list"]}>{smallList}</div>
      </Grid>
    </Grid>
  );
};

export default TrendingProducts;
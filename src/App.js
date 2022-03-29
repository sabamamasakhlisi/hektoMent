import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import {
  getCategories,
  getSales,
  getProducts,
  getUserData,
  getInitialCartState,
  getTrendingItems,
  getMyOrders,
} from "./store/thunk";
import { useDispatch } from "react-redux";
import { useSession } from "./contexts/auth-context";
import { useIdleTimer } from "react-idle-timer";
import { auth } from "./config/config";
import { timers } from "./constants/timers";

import * as localStorage from "./helpers/local-storage";

import SplashPage from "./pages/SplashPage/SplashPage";
import Homepage from "./pages/Homepage";
import ProductDetails from "./pages/ProductDetails";
import Signup from "./pages/Signup";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";
import Order from "./pages/Order";
import OrderCompleted from "./pages/OrderCompleted";
import Profile from "./pages/Profile";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import Categories from "./pages/Categories";
import CustomizedDialogs from "./components/CustomizedDialogs";

import ToggleColorMode from "./theme/Toggle";
import classes from "./App.module.scss";

const cartItemsLS = localStorage.get("cart");
const favoritesLS = localStorage.get("favorites");
const initialCartState = { cartItems: cartItemsLS, favorites: favoritesLS };

function App() {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const { user } = useSession();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSales());
    dispatch(getProducts());
    dispatch(getUserData(user?.uid));
    dispatch(getInitialCartState(initialCartState));
    dispatch(getTrendingItems());
    dispatch(getMyOrders(user?.uid));
  }, [initialCartState, dispatch, user]);

  const onIdle = () => {
    auth
      .signOut()
      .then(() => {
        history.push("/homepage");
      })
      .catch((err) => console.log(err));
    setShowLogoutAlert(true);
  };

  const idleTimer = useIdleTimer({ onIdle, timeout: timers.logout });

  console.log(idleTimer);

  return (
    <ToggleColorMode>
      <Switch>
        <Route exact path="/">
          {!user ? <SplashPage /> : <Redirect to="/homepage" />}
        </Route>
        <Route path="/homepage">
          <Homepage />
          <CustomizedDialogs
            open={showLogoutAlert}
            handleClose={() => setShowLogoutAlert(false)}
            buttonText="Okay"
          >
            <p className={classes.dialog}>
              You've been logged out due to security reasons.
            </p>
          </CustomizedDialogs>
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/shop">
          <Shop />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/product/:id">
          <ProductDetails />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/products">
          <Products />
        </Route>
        <Route path="/contact">
          <h1 className="temporary">Contact form</h1>
        </Route>
        <Route exact path="/order">
          <Order />
        </Route>
        <Route path="/order-completed">
          <OrderCompleted />
        </Route>
        <Route path="/order-history">
          <OrderHistory />
        </Route>
        <Route path="/order-tracking">
          <OrderTracking />
        </Route>
        <Route path="/categories">
          <Categories />
        </Route>
      </Switch>
    </ToggleColorMode>
  );
}

export default App;

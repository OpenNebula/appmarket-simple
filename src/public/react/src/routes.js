import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { LayoutWithHeader, LayoutWithoutHeader } from './components/HOC';
import Product from './components/containers/Product';
import Catalog from './components/containers/Catalog';
import Error404 from './components/views/Error404';
export default () => (
  <Switch>
    <Route exact path="/" render={props => LayoutWithHeader(Catalog)(props)} />

    <Route path="/:id?" render={props => LayoutWithHeader(Product)(props)} />

    <Route render={LayoutWithoutHeader(Error404)} />
  </Switch>
);

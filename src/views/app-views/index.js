import React, { lazy, Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Loading from 'components/shared-components/Loading'
import { APP_PREFIX_PATH } from 'configs/AppConfig'

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path={`${APP_PREFIX_PATH}/home`} component={lazy(() => import(`./home.js`))} />
        <Route
          path={`${APP_PREFIX_PATH}/catalog/products`}
          component={lazy(() => import(`./products/ProductsList.js`))}
        />
        <Route path={`${APP_PREFIX_PATH}/dragdrop`} component={lazy(() => import(`./dragdrop/Dragdrop.js`))} />
        <Route path={`${APP_PREFIX_PATH}/clients/list`} component={lazy(() => import(`./clients/UsersList.js`))} />
        <Route path={`${APP_PREFIX_PATH}/clients/:id`} component={lazy(() => import(`./clients/UserProfile.js`))} />
        <Redirect from={`${APP_PREFIX_PATH}`} to={`${APP_PREFIX_PATH}/catalog/products`} />
      </Switch>
    </Suspense>
  )
}

export default React.memo(AppViews)

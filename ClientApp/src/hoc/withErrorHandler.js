import React, { Component } from 'react';

import { ApplicationPaths } from '../components/api-authorization/ApiAuthorizationConstants';
import authService from '../components/api-authorization/AuthorizeService';
import axios from '../axios';
import history from '../history';

const withErrorHandler = (WrappedComponent) => {
  return class extends Component {
    UNSAFE_componentWillMount() {
      this.initIntercaptors();
    }

    initIntercaptors() {
      this.reqIntercaptor = axios.interceptors.request.use(req => {
        return authService.getAccessToken()
          .then(token => {
            req.headers.Authorization = `Bearer ${token}`;
            return req;
          })
          .catch(() => req);
      });

      this.resInterceptor = axios.interceptors.response.use(res => res, error => {
        if (error.response.status === 401) {
          history.push(`${ApplicationPaths.Login}`);
        }
      });
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqIntercaptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
};

export default withErrorHandler;
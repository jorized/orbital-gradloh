import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { LoadingContext } from './LoadingContext'; // Import the Loading Context
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const AxiosContext = createContext();
const authApiUrl = process.env.EXPO_PUBLIC_API_AUTH_URL;
const publicApiUrl = process.env.EXPO_PUBLIC_API_URL;
const { Provider } = AxiosContext;

const AxiosProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { setIsLoading } = useContext(LoadingContext); // Use the Loading Context
  const [isRefreshed, setIsRefreshed] = useState(false);
  const requestQueue = [];
  let isRefreshing = false;

  const processQueue = (error, token = null) => {
    requestQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    requestQueue.length = 0;
  };

  const publicAxios = axios.create({
    baseURL: authApiUrl,
  });

  const authAxios = axios.create({
    baseURL: publicApiUrl,
    headers: {
      Authorization: `Bearer ${ authContext ? authContext.getAccessToken() : null}`,
    },
  });

  authAxios.interceptors.response.use(null, async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        setIsLoading(true); // Show loading indicator

        const data = {
          refreshToken: authContext.authState.refreshToken,
        };
        const options = {
          method: 'POST',
          data,
          url: `${authApiUrl}/refresh`,
        };

        try {
          const tokenRefreshResponse = await axios(options);
          isRefreshing = false;
          setIsLoading(false); // Hide loading indicator

          authContext.setAuthState({
            ...authContext.authState,
            accessToken: tokenRefreshResponse.data.accessToken,
          });

          await SecureStore.setItemAsync(
            'token',
            JSON.stringify({
              accessToken: tokenRefreshResponse.data.accessToken,
              refreshToken: authContext.authState.refreshToken,
            })
          );

          processQueue(null, tokenRefreshResponse.data.accessToken);

          originalRequest.headers.Authorization =
            'Bearer ' + tokenRefreshResponse.data.accessToken;

          return authAxios(originalRequest);
        } catch (e) {
          if (e.response && e.response.data.message === "Token expired. Please login again or use a refresh token.") {
            // Alert.alert(
            //   "Your session has expired",
            //   "Please log in again.",
            //   [
            //     {
            //       text: "OK",
            //       onPress: () => {
            //         authContext.logout();
            //       },
            //     },
            //   ],
            //   { cancelable: false }
            // );
            authContext.logout();
          }
          isRefreshing = false;
          setIsLoading(false); // Hide loading indicator
          processQueue(e, null);
        }
      }

      const retryOriginalRequest = new Promise((resolve, reject) => {
        requestQueue.push({ resolve, reject });
      });

      return retryOriginalRequest
        .then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return authAxios(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  });

  return (
    <Provider value={{ authAxios, publicAxios }}>
      {children}
    </Provider>
  );
};

export { AxiosContext, AxiosProvider };

import React, { createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as SecureStore from 'expo-secure-store';

const AxiosContext = createContext();
const authApiUrl = process.env.EXPO_PUBLIC_API_AUTH_URL;
const publicApiUrl = process.env.EXPO_PUBLIC_API_URL;
const { Provider } = AxiosContext;



const AxiosProvider = ({ children }) => {
	const authContext = useContext(AuthContext);

	//Those who are authenticated, use this route
	const authAxios = axios.create({
		baseURL: publicApiUrl
	});

	//Those who are not, use this route
	const publicAxios = axios.create({
		baseURL: authApiUrl
	});

	//Public routes always need a bearer token
	authAxios.interceptors.request.use(
		(config) => {
			if (!config.headers.Authorization) {
				config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
			}

			return config;
		},
		(error) => {
			console.log("COMES");
			return Promise.reject(error);
		}
	);

	const refreshAuthLogic = (failedRequest) => {
		const data = {
			refreshToken: authContext.authState.refreshToken
		};
		const options = {
			method: 'POST',
			data,
			url: authApiUrl + '/refresh'
		};

		return axios(options)
			.then(async (tokenRefreshResponse) => {
				failedRequest.response.config.headers.Authorization =
					'Bearer ' + tokenRefreshResponse.data.accessToken;

				authContext.setAuthState({
					...authContext.authState,
					accessToken: tokenRefreshResponse.data.accessToken
				});
				await SecureStore.setItemAsync(
					'token',
					JSON.stringify({
						accessToken: tokenRefreshResponse.data.accessToken,
						refreshToken: authContext.authState.refreshToken
					})
				)
				return Promise.resolve();
			})
			.catch((e) => {
				authContext.setAuthState({
					accessToken: null,
					refreshToken: null
				});
			});
	};

	createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {statusCodes: [403] });


	return (
		<Provider
			value={{
				authAxios,
				publicAxios
			}}
		>
			{children}
		</Provider>
	);
};

export { AxiosContext, AxiosProvider };

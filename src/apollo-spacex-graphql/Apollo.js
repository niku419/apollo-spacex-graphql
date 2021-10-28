import moment from 'moment'
import React from 'react'
import NavBar from './components/NavBar'
import history from './historyData';
import * as Sentry from '@sentry/browser';
import { message } from 'antd';
import { get, isObject } from 'lodash';
import { onError } from '@apollo/client/link/error'
import { defaultDateFormat } from './common/constants'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  createHttpLink,
  from
} from "@apollo/client"

let disableToastTimeout = null
export const cacheData = new InMemoryCache()
export function dateConvert(date) {
  return moment(date).format(defaultDateFormat)
} 
const toast = ({ message: content, type }) => {
  message.destroy();
  switch (type) {
    case 'info':
      message.info(content);
      break;
    case 'success':
      message.success(content);
      break;
    case 'warning':
      message.warning(content);
      break;
    case 'error':
      message.error(content);
      break;
    default:
      break;
  }
};
const httpLink = createHttpLink({
  uri: 'https://api.spacex.land/graphql/',
  credentials: 'same-origin'
})
const responseMessageLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const { data } = response;

    if (
      data &&
      isObject(data) &&
      Object.keys(data).length > 0 &&
      data[`${Object.keys(data)[0]}`] &&
      data[`${Object.keys(data)[0]}`].message
    ) {
      if (Object.keys(data)[0] === 'forgotUserPassword') {
        if (data[`${Object.keys(data)[0]}`].status !== 'ERROR') {
          setTimeout(() => {
            toast({
              message:
                data[`${Object.keys(data)[0]}`].message ||
                'Operation successful',
              type: 'success'
            });
          }, 1000);
        }
      } else {
        setTimeout(() => {
          const oResponse = data[`${Object.keys(data)[0]}`];

          if (!response) {
            return;
          }

          toast({
            message: oResponse.message || 'Operation successful',
            type: oResponse.status === 'ERROR' ? 'error' : 'success'
          });
        }, 1000);
      }
    }
    return response;
  });
});

const errorLink = onError((options) => {
  const { graphQLErrors, networkError, response } = options;

  if (networkError && networkError.statusCode === 405) {
    if (disableToastTimeout) {
      clearTimeout(disableToastTimeout);
    }

    disableToastTimeout = setTimeout(() => {
      if (networkError.result && networkError.result.message) {
        toast({
          message: networkError.result.message,
          type: 'error'
        });
      }
    }, 200);

    history.replace('/logout');
    return;
  }

  if (graphQLErrors && graphQLErrors.length > 0) {
    const isForBidden =
      get(graphQLErrors[0], 'extensions.code') === 'FORBIDDEN';

    if (!isForBidden) {
      setTimeout(() => {
        toast({
          message: graphQLErrors[0].message,
          type: 'error'
        });
      }, 1000);
    }
  } else {
    setTimeout(() => {
      toast({
        message: 'Something went wrong!',
        type: 'error'
      });
    }, 1000);
  }

  if (response) {
    response.errors.map((error) => {
      const { message: errorMessage, locations, path, extensions } = error;

      // Enable when sentry integrated
      Sentry.captureException(
        new Error(
          `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
        )
      );

      if (extensions && extensions.code === 'FORBIDDEN') {
        history.replace('/access-denied');
      }

      if (
        extensions &&
        (extensions.code === 'UNAUTHENTICATED' ||
          extensions.code === 405 ||
          extensions.exception.name === 'JsonWebTokenError')
      ) {
        history.replace('/logout');
      }

      // eslint-disable-next-line no-console
      return console.log(
        `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`);
    Sentry.captureException(new Error(`[Network error]: ${networkError}`));
  }
});
export const client = new ApolloClient({
  link: from([responseMessageLink, errorLink, httpLink]),
  cache: cacheData
})

export default function Apollo({children}) {

  return (
    <ApolloProvider client={client}>
        <NavBar/>
        {children}
    </ApolloProvider>
  )
}

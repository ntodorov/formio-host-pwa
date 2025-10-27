import  { useEffect, useState } from 'react';
import log from 'loglevel';
import { useAuth0 } from '@auth0/auth0-react';
import config from '../config';
import {
  getBaMetaFromUser,
  getUserType,
  handleTimeout,
} from '../utilities/utils';
import { UserType } from '../utilities/constants';

export const useApp = () => {
  const {
    isAuthenticated,
    isLoading,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();
  const [isTokenParsed, setIsTokenParsed] = useState<boolean>(false);
  const [userType, setUserType] = useState<UserType>(UserType.Unknown);

  useEffect(() => {
    (async function login() {
      if (!isLoading && !user) {
        await loginWithRedirect();
      }
    })();
  }, [isLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims()
        .then((claims) => {
          if (claims) {
            localStorage.setItem(config.tokenKey, claims.__raw);

            if (UserType.Internal === getUserType(user)) {
              log.debug('internal user detected');
              setUserType(UserType.Internal);
            } else if (UserType.External === getUserType(user)) {
              log.debug('external user detected');
              setUserType(UserType.External);
              const { primaryBaId, baMembership } = getBaMetaFromUser(user);
              const cachedBaId = localStorage.getItem(config.baIdKey);
              const currentBaId = baMembership.find(
                (m) => m?.baId === cachedBaId
              )?.baId;

              if (!currentBaId) {
                localStorage.setItem(config.baIdKey, primaryBaId);
              }
            } else {
              log.error('unknown user type!');
            }

            if (claims.exp) {
              handleTimeout(claims.exp, logout);
            }
            setIsTokenParsed(true);
          }
        })
        .catch((err) => {
          log.error('Cannot silently get token', err);
        });
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return {
    isLoading,
    isTokenParsed,
    error,
    isAuthenticated,
    getAccessTokenSilently,
    userType,
    user,
    logout,
  };
};

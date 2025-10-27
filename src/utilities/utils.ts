import log from 'loglevel';
import { UserType } from './constants';

type BaMembership = {
  baId: string;
  baName: string;
  licenceEligibilityType: string;
};

interface IBaMeta {
  primaryBaId: string;
  primaryBaName: string;
  baMembership: [BaMembership];
}

interface UserClaims {
  'https://schema.aer.ca/userType'?: string;
  'https://schema.aer.ca/primaryBaId'?: string;
  'https://schema.aer.ca/primaryBaName'?: string;
  'https://schema.aer.ca/baMembership'?: [BaMembership];
  [key: string]: any;
}

export const getUserType = (user: UserClaims = {} as UserClaims): UserType => {
  if (
    !Object.prototype.hasOwnProperty.call(
      user,
      'https://schema.aer.ca/userType'
    )
  ) {
    return UserType.Unknown;
  }

  const userElement = user['https://schema.aer.ca/userType'];
  if (userElement === 'internal') {
    return UserType.Internal;
  } else if (userElement === 'external') {
    return UserType.External;
  } else {
    log.error(`unknown type ${userElement}`);
    return UserType.Unknown;
  }
};

export const getBaMetaFromUser = (
  user: UserClaims = {} as UserClaims
): IBaMeta => {
  if (
    !user['https://schema.aer.ca/primaryBaId'] ||
    !user['https://schema.aer.ca/primaryBaName'] ||
    !user['https://schema.aer.ca/baMembership'] ||
    !user['https://schema.aer.ca/userType']
  )
    throw new Error('invalid user object');

  return {
    primaryBaId: user['https://schema.aer.ca/primaryBaId'],
    primaryBaName: user['https://schema.aer.ca/primaryBaName'],
    baMembership: user['https://schema.aer.ca/baMembership'],
  };
};

export const handleTimeout = (expiryInteger: number, logoutFunc: Function) => {
  const expiry = new Date(expiryInteger * 1000);
  const timeout = expiry.getTime() - new Date().getTime();
  /*console.log(
    `token expiry time: ${expiry}, logout timer timeout (milliseconds): ${timeout})} `
  );*/
  if (timeout <= 0) {
    logoutFunc();
  } else {
    setTimeout(logoutFunc, timeout);
  }
};

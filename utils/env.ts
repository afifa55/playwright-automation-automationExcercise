import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable "${key}". Copy .env.example to .env and set a value.`);
  }
  return value;
};

export const env = {
  BASE_URL: required('BASE_URL'),
  PASSWORD: required('PASSWORD'),
  NAME: required('NAME'),
  FIRST_NAME: required('FIRST_NAME'),
  LAST_NAME: required('LAST_NAME'),
  COMPANY: required('COMPANY'),
  ADDRESS: required('ADDRESS'),
  COUNTRY: required('COUNTRY'),
  STATE: required('STATE'),
  CITY: required('CITY'),
  ZIPCODE: required('ZIPCODE'),
  MOBILE: required('MOBILE'),
  CARD_NAME: required('CARD_NAME'),
  CARD_NUMBER: required('CARD_NUMBER'),
  CVC: required('CVC'),
  EXPIRY_MONTH: required('EXPIRY_MONTH'),
  EXPIRY_YEAR: required('EXPIRY_YEAR'),
  INVALID_EMAIL: required('INVALID_EMAIL'),
  INVALID_PASSWORD: required('INVALID_PASSWORD'),
  SEARCH_KEYWORD: required('SEARCH_KEYWORD'),
  NO_RESULT_KEYWORD: required('NO_RESULT_KEYWORD'),
  CONTACT_SUBJECT: required('CONTACT_SUBJECT'),
  CONTACT_MESSAGE: required('CONTACT_MESSAGE'),
  TITLE: required('TITLE'),
  BIRTH_DAY: required('BIRTH_DAY'),
  BIRTH_MONTH: required('BIRTH_MONTH'),
  BIRTH_YEAR: required('BIRTH_YEAR'),
  PRODUCT_NAME: required('PRODUCT_NAME'),
  PRODUCT_PRICE: Number(required('PRODUCT_PRICE')),
  PRODUCT_CATEGORY: required('PRODUCT_CATEGORY'),
  PRODUCT_BRAND: required('PRODUCT_BRAND'),
  SECOND_PRODUCT_NAME: required('SECOND_PRODUCT_NAME'),
  SECOND_PRODUCT_PRICE: Number(required('SECOND_PRODUCT_PRICE')),
  QUANTITY: Number(required('QUANTITY')),
  REVIEW_NAME: required('REVIEW_NAME'),
  REVIEW_EMAIL: required('REVIEW_EMAIL'),
  REVIEW_TEXT: required('REVIEW_TEXT'),
  CATEGORY_WOMEN_SUB: required('CATEGORY_WOMEN_SUB'),
  CATEGORY_MEN_SUB: required('CATEGORY_MEN_SUB'),
  CATEGORY_KIDS_SUB: required('CATEGORY_KIDS_SUB'),
  BRAND: required('BRAND'),
  ORDER_COMMENT: required('ORDER_COMMENT'),
};

export const url = (pathname: string): string => new URL(pathname, env.BASE_URL).toString();

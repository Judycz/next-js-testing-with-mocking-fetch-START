
import Home from '../pages';

import 'isomorphic-fetch';// needed for no "fetch is not defined errors

import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { rest } from 'msw'; // this will essentially mock the rest calls.
import { setupServer } from 'msw/node' // we'll set up a "mocked" server

import { BASE_URL } from '../utils/api/base.js' // we'll need this for our "mocked" server

import { http, HttpResponse } from "msw";//mocks the rest responses



//start the mock server

//clean up the mock server

// ... imports from above ...
//set up the mock server to listen to requests
const QUOTE = "All I required to be happy was friendship and people I could admire."
const AUTHOR = "Charles Baudelaire"


const server = setupServer(
  http.get(`${BASE_URL}/random`, (req, res, ctx) => {
    return HttpResponse.json(
      {
        content: QUOTE,
        author: AUTHOR,
      });
  })
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

// ... we'll write our tests down here ...
test("home loads a quote on mount", async () => {
  //render
  await act(() => {
    render(<Home />);
  })

  //get quote author 
  let quoteElement = screen.getByTestId("quote");
  let authorElement = screen.getByTestId("author");

  //check correct contents
  expect(quoteElement).toHaveTextContent(QUOTE);
  expect(authorElement).toHaveTextContent(AUTHOR);
});


//
test("should load a new quote when button clicked", async () => {
  await act(() => {
    render(<Home />);

  });

  const NEW_QUOTE = "I cant "
  const NEW_AUTHOR = "Dan "

  server.use(
    http.get(`${BASE_URL}/random`, (req, res, ctx) => {
      return HttpResponse.json({
        content: NEW_QUOTE,
        author: NEW_AUTHOR
      });
    })
  );


  //
  let buttonElement = screen.getByText("Get New Quote");

  await act(() => {
    buttonElement.click();
  });
});

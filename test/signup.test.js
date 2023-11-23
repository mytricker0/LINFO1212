const{JSDOM} = require('jsdom');
const{describe,test,expect,beforeEach} = require('@jest/globals');


let dom;

beforeEach(() => {
  dom = new JSDOM('<!DOCTYPE html><html><body>' +
    '<input type="password" id="password" value="passwordTest">' +
    '<input type="password" id="confirmPassword" value="confirmPasswordTest">' +
    '<div id="message"></div>' +
    '<button id="submitButton" disabled></button>' +
    '</body></html>');
  global.document = dom.window.document;
});


const{checkPassword}= require('../scripts/signup');

describe('checkPassword tests', () => {
    test('check if password match', () => {
      document.getElementById("password").value = '1234';
      document.getElementById("confirmPassword").value = '1234';

      expect(checkPassword()).toBe(true);
      expect(document.getElementById('message').textContent).toBe('Passwords match');
    });

    test('check if password do not match', () => {
      document.getElementById("password").value = 'password123';
      document.getElementById("confirmPassword").value = 'Password123';

      expect(checkPassword()).toBe(false);
      expect(document.getElementById('message').textContent).toBe("Passwords don't match");
    });
    test('check if password is empty', () => {
      document.getElementById("password").value = '';
      document.getElementById("confirmPassword").value = '';

      expect(checkPassword()).toBe(true);
      expect(document.getElementById('message').textContent).toBe("");
    })
});
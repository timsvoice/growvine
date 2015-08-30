describe('User Authentication', function() {
  
  var baseUrl = 'http://localhost:3000/#!';
  var userCredentials = {
    email: 'users@mail.com',
    password: 'password'
  }

  it('should sign up a new user', function() {
    // Load the AngularJS homepage.
    browser.get(baseUrl + '/signup');

    // Find the element with ng-model matching 'yourName' - this will
    // find the <input type="text" ng-model="yourName"/> element - and then
    // type 'Julie' into it.
    element(by.css('form [id*=input_email]')).sendKeys(userCredentials.email);
    element(by.css('form [id*=password_password]')).sendKeys(userCredentials.password);
    element(by.css('form button[type=submit]')).click();
    // Assert that the text element has the expected value.
    // Protractor patches 'expect' to understand promises.
    expect(browser.getLocationAbsUrl())
        .toBe('/');
    // expect($scope.authentication.user.email).toEqual('tim@mail.com');
  });

  afterEach(function(){
    // user sign in
    // browser.get(baseUrl + '/signin');
    // element(by.css('[id*=input_email]')).sendKeys(userCredentials.email);    
    // element(by.css('[id*=password_password]')).sendKeys(userCredentials.password);    
    // element(by.css('button[type=submit]')).click();    

    // delete user
    browser.get(baseUrl + '/settings/profile')
    element(by.css('button.delete')).click(); 
    expect(browser.getLocationAbsUrl())
        .toBe('/');   
  })
});

describe('User Authentication', function() {
  
  var baseUrl = 'http://localhost:3000/#!';
  var userCredentials = {
    email: 'users@mail.com',
    password: 'password'
  }

  it('should sign in an existing user', function() {
    // user sign in
    browser.get(baseUrl + '/signin');
    element(by.css('[id*=user-email]')).sendKeys(userCredentials.email);    
    element(by.css('[id*=user-password]')).sendKeys(userCredentials.password);    
    element(by.css('button[type=submit]')).click();  
    expect(browser.getLocationAbsUrl())
        .toBe('/');    
  });

  it('should update a user profile', function() {
    // user sign in
    browser.get(baseUrl + '/signin');
    element(by.css('[id*=user-email]')).sendKeys(userCredentials.email);    
    element(by.css('[id*=user-password]')).sendKeys(userCredentials.password);    
    element(by.css('button[type=submit]')).click();  
    expect(browser.getLocationAbsUrl())
        .toBe('/');  
    // update user profile
    browser.get(baseUrl + '/settings/profile');
    element(by.buttonText('Save Profile')).click();
  });

  afterEach(function(){
    browser.get(baseUrl + '/');
    element(by.css('.user-signout')).click();
  })

});

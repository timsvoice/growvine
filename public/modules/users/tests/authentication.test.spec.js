describe('User Authentication', function() {
  
  var baseUrl = 'http://localhost:3000/#!';
  var userCredentials = {
    email: 'users@mail.com',
    password: 'password',
    firstName: 'John'
  }

  var signin = function() {
    browser.get(baseUrl + '/');
    element(by.css('a.signin')).click();
    browser.wait(EC.visibilityOf($('#user-signin-email')), 2000);
    element(by.css('#user-signin-email')).sendKeys(userCredentials.email);    
    element(by.css('#user-signin-password')).sendKeys(userCredentials.password);       
    element(by.css('button#signin')).click(); 
  }

  var EC = protractor.ExpectedConditions;

  it('should sign in an existing user', function() {
    // user sign in
    signin();
    expect(browser.getLocationAbsUrl())
        .toBe('/');    
  });

  it('should update a user profile', function() {
    signin();
    // update user profile
    browser.wait(EC.visibilityOf($('.settings')), 5000);
    element(by.css('a.settings')).click();
    expect(browser.getLocationAbsUrl())
        .toBe('/settings/profile');
    browser.wait(EC.visibilityOf($('#firstName')), 5000);
    element(by.css('#firstName')).sendKeys(userCredentials.email);    
    element(by.buttonText('Save Profile')).click();
    browser.wait(EC.textToBePresentInElement($('.text-success'), 'Profile Saved Successfully'), 2000);
  });

  afterEach(function(){
    browser.get(baseUrl + '/');
    browser.wait(EC.visibilityOf($('#signout')), 2000);
    element(by.css('#signout')).click();
  })

});

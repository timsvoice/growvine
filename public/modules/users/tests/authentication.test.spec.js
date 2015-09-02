describe('User Authentication', function() {
  
  var baseUrl = 'http://localhost:3000/#!';
  var userCredentials = {
    email: 'users@mail.com',
    password: 'password'
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
    browser.get(baseUrl + '/');
    element(by.css('a.signin')).click();
    browser.wait(EC.visibilityOf($('#user-signin-email')), 2000);
    element(by.css('#user-signin-email')).sendKeys(userCredentials.email);    
    element(by.css('#user-signin-password')).sendKeys(userCredentials.password);       
    element(by.css('button#signin')).click();  
    expect(browser.getLocationAbsUrl())
        .toBe('/');    
  });

  it('should update a user profile', function() {
    browser.get(baseUrl + '/');
    element(by.css('a.signin')).click();
    browser.wait(EC.visibilityOf($('#user-signin-email')), 2000);
    element(by.css('#user-signin-email')).sendKeys(userCredentials.email);    
    element(by.css('#user-signin-password')).sendKeys(userCredentials.password);       
    element(by.css('button#signin')).click();  
    expect(browser.getLocationAbsUrl())
        .toBe('/'); 
    browser.wait(EC.invisibilityOf($('#signout')), 2000);
    element(by.css('#signout')).click();
    // update user profile
    // browser.get(baseUrl + '/settings/profile');
    // element(by.buttonText('Save Profile')).click();

  });

  afterEach(function(){
    browser.get(baseUrl + '/');
    browser.wait(EC.visibilityOf($('#signout')), 2000);
    element(by.css('#signout')).click();
  })

});

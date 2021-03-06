class LoginRoute extends Route{

  constructor(router) {
    super("^[\/]login$", "Login", "#login");
    this.router = router;

    this.loginPending = false;

    this.onLogin = this.onLogin.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFailure = this.onLoginFailure.bind(this);
    this.registerEventListeners();
  }

  registerEventListeners() {
    var submit = document.querySelector("#login-form");
    submit.addEventListener('submit', this.onLogin);
  }

  onLogin(evt) {
    evt.preventDefault();
    if(this.loginPending) return; //Don't continue if waiting on a request

    var username = document.querySelector("#username").value;
    var password = document.querySelector("#password").value;

    this.toggleForm(false);
    this.router.api.login(username, password)
    .then(this.onLoginSuccess, this.onLoginFailure);
  }

  onLoginSuccess() {
    this.toggleForm(true);

    var notice = document.querySelector('.notice-wrapper');

    var success = this._createDiv("notice", "Please wait...");
    success.style.backgroundColor = "#4CAF50"
    notice.replaceChild(success, notice.firstChild);

    notice.className = 'notice-wrapper';
    notice.focus(); //Used to trigger a reflow (to restart animation)
    notice.className = 'notice-wrapper show';

    this.router.goTo("/");
  }

  onLoginFailure() {
    //TODO: Show error
    this.toggleForm(true);

    var notice = document.querySelector('.notice-wrapper');

    var authFailed = this._createDiv("notice", "Authentication failed");
    authFailed.style.backgroundColor = "#F44336"

    notice.replaceChild(authFailed, notice.firstChild);
    notice.className = 'notice-wrapper';
    notice.focus(); //Used to trigger a reflow (to restart animation)
    notice.className = 'notice-wrapper show';
  }

  toggleForm(allowSubmit) {
    this.loginPending = !allowSubmit;
    document.querySelector("#login-form input[type='submit']")
      .disabled = !allowSubmit;
  }

}

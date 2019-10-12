interface IBaseLogin {
  password: string;
}

interface IUsername extends IBaseLogin {
  username: string;
}

interface IEmail extends IBaseLogin {
  email: string;
}

type ILogin = IUsername | IEmail;

export default ILogin;



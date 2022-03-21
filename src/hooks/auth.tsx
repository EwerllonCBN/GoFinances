import React, { 
  createContext, 
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { SignIn } from "../screens/SignIn";
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";
//Tipando o Contexto
interface AuthProviderProps {
  children: ReactNode; //ReactNode É a tipagem para um elemento filho
}

//Buscando dados sensiveis.
const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;
//Dados do Context tipado para exportação
interface IAuthContextData{
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

interface AthorizationResponse{
  params: {
    access_token: string;
  },
  type: string;
}

interface User {
  id: string,
  name: string,
  email: string,
  photo?: string,
}

//Criando nosso Contexto
const AuthContext = createContext({} as IAuthContextData)

//Criando nosso Fornecedor de Contextos
function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<User>({} as User); //ele armazera baseado no tipo <User> , começa como objeto vazio e é do tipo User {} as User 
  const [userStorageLoading, setUserStorageLoading] = useState(true);
  
  const userStorageKey = '@gofinances:user';


  async function signInWithGoogle(){
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email'); //O encodeURI troca o espaço por um simbolo legível pelo browser, assim não quebra a requisição

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`; //Pq iremos utilizar a lib de autenticação do expo
      const {params, type} = await AuthSession
      .startAsync({ authUrl }) as AthorizationResponse; //O response ira guardar o que vai acontecer na requisição de autenticação
      
      //Fetch é proprio do javaScript pra consumir EndPoints e fazer requisição HTTP
      if(type === 'success'){
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const userInfo = await response.json();
        const userLogged = {
          id: String(userInfo.id!), 
          email: userInfo.email!,
          name: userInfo.given_name!,
          photo: userInfo.picture!
        }
        console.log(userInfo);
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }      
    } catch (error) {
      throw new Error(error as string)
    }
  }

  async function signInWithApple(){
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });
      if(credential){
        const name = credential.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=2`
        const userLogged = {
          id: String(credential.user), 
          email: credential.email!,
          name,
          photo,
        }
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));

        console.log(userLogged);
      }
    } catch (error) {
      throw new Error(error as string);      
    }
  }

  async function signOut(){
    setUser({} as User); 
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    async function loadUserStorageData(){
      const userStoraged = await AsyncStorage.getItem(userStorageKey);

      if(userStoraged) setUser(JSON.parse(userStoraged));

      setUserStorageLoading(false);
    }

    loadUserStorageData();
    
  }, [])
  return(
    <AuthContext.Provider value={{
        user, 
        signInWithGoogle, 
        signInWithApple,
        signOut,
        userStorageLoading
      }}>
      {children}
    </AuthContext.Provider>
  )
}

//Criando nossa função de estado para nosso contexto 
function useAuth(){
  const context = useContext(AuthContext);

  return context;
}
export { AuthProvider, useAuth}
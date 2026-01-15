import Login from "./Login";
import Registration from "./Registration";
import logo from "./assets/logo.png"; 

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
    return (
        <div className="flex bg-white h-screen">
            <div className="w-1/2 flex items-center justify-center">
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="max-w-md w-1/2 object-contain" 
                />
            </div>

            <div className="bg-sky-500 h-screen w-1/2 px-50 flex flex-col justify-center">
                {mode === "login" ?
                    <Login /> :
                    <Registration />
                }
            </div>
        </div>
    )
}
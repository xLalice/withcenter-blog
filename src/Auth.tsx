import Login from "./Login";
import Registration from "./Registration";

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
    return (
        <div className="flex bg-black h-screen">
            <div className="w-1/2"></div>

            <div className="bg-slate-500 h-screen w-1/2 px-50 flex flex-col justify-center">
                {mode === "login" ?
                    <Login /> :
                    <Registration />
                }
            </div>
        </div>
    )
}
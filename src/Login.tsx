export default function Login() {
    return (
        <>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mb-10">
                Log in to continue writing and sharing your stories
            </p>

            <form className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    className="input input-neutral w-full"
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    className="input input-neutral w-full"
                />

                <button className="btn btn-neutral mt-5">
                    Log in
                </button>
            </form>
        </>
    );
}

export default function Registration() {
    return (
        <>
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="mb-10">Sign in to continue writing and sharing your storiers</p>

            <form className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input type='email' name="email" className="input input-neutral w-full" />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" className="input input-neutral w-full" />

                <button className="btn btn-neutral mt-5">Register</button>
            </form>
        </>
    )
}
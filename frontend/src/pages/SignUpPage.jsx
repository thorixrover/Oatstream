import { useState } from "react";
import { Wheat } from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: signupMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, signupMutation } = useSignUp();



    const handleSignup = (e) => {
        e.preventDefault();
        signupMutation(signupData);
    }




return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p8" data-theme="night">
    <div className="border border-cyan-700 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
            {/* LOGO */}
            <div className="mb-4 flex items-center justify-start gap-2">
                <Wheat className="size-9 text-cyan-500" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    Oatstream
                </span>
            </div>

            {/* ERROR MASSAGE IF ANY */}
            {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

            <div className="w-full">
            <form onSubmit={handleSignup}>
                <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Create an Account</h2>
                        <p className="text-sm opacity-70">
                        Bergabunglah dengan Oatstream dan jelajahi bahasa-bahasa dunia bersama!
                        </p>
                </div>
                <div className="space-y-3">


                  {/* FULLNAME */}
                <div className="form-control w-full">
                    <label className="label">
                    <span className="label-text">
                        Full Name
                        </span>
                    </label>

                    <input
                    type="text"
                    placeholder="Masukkan Nama Anda"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                    />
                </div>

                {/* EMAIL */}
                <div className="form-control w-full">
                    <label className="label">
                    <span className="label-text">
                        Email
                        </span>
                    </label>
                    <input
                    type="email"
                    placeholder="masukkan email anda"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                    />
                </div>

                {/* PASSWORD */}
                <div className="form-control w-full">
                    <label className="label">
                    <span className="label-text">
                        Password
                        </span>
                    </label>
                    <input
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                    />
                    <p className="text-xs opacity-70 mt-1">
                        Password must be at least 6 characters long
                    </p>
                </div>


                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm" required />
                    <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-cyan-500 hover:underline">terms of service</span> and{" "}
                        <span className="text-cyan-500 hover:underline">privacy policy</span>
                    </span>
                    </label>
                </div>
                </div>

                <button className='btn w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white border-none' type='submit'>
                    {isPending ? (
                    <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Loading...
                    </>
                    ) : (
                    "Create Account"
                    )}
                </button>


                <div className='text-center mt-4'>
                    <p className="text-sm">
                        Sudah pernah daftar sebelumnya?{" "}
                        <Link to="/login" className="text-cyan-500 hover:underline">
                        Sign in
                        </Link>
                    </p>
                </div>


            </div>
            </form>
                
            </div>
        </div>

        {/* SIGNUP IMAGE - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
            <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
                <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
                <h2 className="text-xl font-semibold">Jalin koneksi dengan teman belajar bahasa di seluruh dunia</h2>
                <p className="opacity-70">
                Latihan percakapan, cari teman baru, dan tingkatkan kemampuan bahasa bersama!
                </p>
            </div>
            </div>
        </div>
    </div>
    </div>
);
}

export default SignUpPage;

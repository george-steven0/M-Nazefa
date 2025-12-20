import { Controller, useForm } from "react-hook-form";
import type { loginProps } from "../../components/Utilities/Types/types";
import logo from "../../assets/imgs/logo-cropped.svg";
import { Button, Input } from "antd";
import { useLoginMutation } from "../../components/APIs/Auth/AUTH_QUERY";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import navVector from "../../assets/imgs/navbarVector.svg";

const Login = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<loginProps>();

  const [login, { isLoading }] = useLoginMutation();

  const submitForm = async (data: loginProps) => {
    try {
      const res = await login(data).unwrap();
      // console.log(res);
      if (res?.isSuccess) {
        toast.success("Login Successfully");
        localStorage.setItem("mNazTk", res?.data?.token);
        navigate("/dashboard");
      } else {
        toast.error(res?.errorMessages?.join("\n"));
      }
    } catch (error) {
      const err = error;
      console.log(err);
    }
  };
  return (
    <main className="h-screen w-full bg-[#ebf3fa] min-h-[500px] overflow-y-auto relative">
      <section className="size-full flex flex-col gap-4 items-center justify-center">
        <div>
          <p className="lg:text-4xl font-semibold bg-linear-to-r from-mainColor to-[#1d6987] text-transparent bg-clip-text">
            Welcome Back!
          </p>
        </div>
        <div className="flex flex-col items-center gap-5 min-w-[350px] min-h-[350px] p-4 rounded-md shadow-md bg-white">
          <img src={logo} alt="Madame nazefa logo" className="size-[150px]" />

          <form
            onSubmit={handleSubmit(submitForm)}
            className="flex flex-col gap-4 w-full"
          >
            <div>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Email is not valid",
                  },
                }}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      placeholder="Enter Email"
                      status={errors.email ? "error" : ""}
                    />
                  );
                }}
              />

              {errors?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                }}
                render={({ field }) => {
                  return (
                    <Input.Password
                      {...field}
                      placeholder="Enter Password"
                      status={errors.password ? "error" : ""}
                    />
                  );
                }}
              />

              {errors?.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              htmlType="submit"
              className="w-full bg-mainColor text-white py-5"
              loading={isLoading}
            >
              Login
            </Button>
          </form>
        </div>
      </section>

      <div className="absolute bottom-0 left-0">
        <img src={navVector} className="size-full" alt="linth" />
      </div>
    </main>
  );
};

export default Login;

import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { loginSchema, type LoginFormData } from "../schemas/login-schema";

export function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit({ username, password }: LoginFormData) {
    try {
      await login(username, password);
      navigate("/"); // Home protegida
    } catch (err: any) {
      setErrorLogin(err.message);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              className="border rounded p-2"
              {...register("username")}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="border rounded p-2"
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {errorLogin && <p className="text-red-500 text-sm mt-1">{errorLogin}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}


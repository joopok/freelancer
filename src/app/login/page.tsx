"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuthStore();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login(username, password);

      if (response.success && response.user) {
        setUser(response.user);
        router.push("/");
      } else {
        setError(response.error || "로그인에 실패했습니다.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(67vh-4rem)] bg-gray-50 overflow-hidden">
      <div className="h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-3">
            로그인
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-4 px-4 shadow sm:rounded-lg sm:px-8">
            {error && (
              <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700"
                >
                  로그인 ID
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  비밀번호
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const response = await fetch(
                        "http://localhost:8081/api/auth/login",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            username: username,
                            password: password,
                          }),
                        }
                      );
                      console.log(
                        JSON.stringify(
                          "================================================" +
                            response
                        )
                      );
                      const data = await response.json();
                      console.log(JSON.stringify(data, null, 4));
                      console.log(
                        JSON.stringify(
                          "================================================"
                        )
                      );

                      if (!data.success === true) {
                        throw new Error(data.error || "로그인에 실패했습니다.");
                      }
                      console.log(
                        JSON.stringify(
                          "================================================"
                        )
                      );
                      useAuthStore.getState().setUser(data.user);
                      router.push("/");
                    } catch (error) {
                      setError(
                        error instanceof Error
                          ? error.message
                          : "로그인 중 오류가 발생했습니다."
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </button>
              </div>
            </form>

            {/* 소셜 로그인 */}
            <div className="mt-4">
              <p className="text-center text-sm text-gray-500 mb-2">
                간편 로그인
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="p-2 rounded-full border hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <Image
                    src="/images/naver-icon.png"
                    alt="Naver"
                    width={24}
                    height={24}
                  />
                </button>
                <button
                  className="p-2 rounded-full border hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <Image
                    src="/images/kakao-icon.png"
                    alt="Kakao"
                    width={24}
                    height={24}
                  />
                </button>
                <button
                  className="p-2 rounded-full border hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <Image
                    src="/images/facebook-icon.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </button>
                <button
                  className="p-2 rounded-full border hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <Image
                    src="/images/google-icon.png"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>

            {/* 회원가입 및 계정 찾기 링크 */}
            <div className="mt-3 flex justify-center gap-4 text-sm text-gray-600">
              <Link href="/register" className="hover:text-blue-500">
                회원가입
              </Link>
              <span>|</span>
              <Link href="/find-id" className="hover:text-blue-500">
                아이디 찾기
              </Link>
              <span>|</span>
              <Link href="/find-password" className="hover:text-blue-500">
                비밀번호 찾기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
